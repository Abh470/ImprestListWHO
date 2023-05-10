import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
//import { IReadonlyTheme } from '@microsoft/sp-component-base';
//import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import { SPComponentLoader } from "@microsoft/sp-loader";
//import * as pnp from 'sp-pnp-js';
//import { sp, Web } from "@pnp/sp/presets/all"
import "jquery";
import * as strings from 'AdminExclusionWebPartStrings';

require("bootstrap");
require("../../webparts/CommonAssets/assets/css/padding.css");
require("../../webparts/CommonAssets/assets/css/styles.css");
require("../../webparts/CommonAssets/Style.css");
require("../../webparts/CommonAssets/Common.js");
require("../../webparts/CommonAssets/assets/css/jquery.multiselect.css");
require("../../webparts/CommonAssets/assets/js/jquery.multiselect.js");
const IprsLogo: any = require("../../webparts/CommonAssets/assets/images/IPRS-logo.png");


export interface IAdminExclusionWebPartProps {
  description: string;
}

export default class AdminExclusionWebPart extends BaseClientSideWebPart<IAdminExclusionWebPartProps> {

  protected onInit(): Promise<void> {
    sp.setup(this.context as any);
    return super.onInit();
  }

  public async render(): Promise<void> {


    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    //SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    //SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js");


    this.domElement.innerHTML = `
        <nav class="navbar navbar-custom header-nav">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#"><img src="${IprsLogo}" class="logo" alt=""></a>
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>

                </div>
                <div class="collapse navbar-collapse" id="myNavbar">
                </div>
            </div>
        </nav>

        <div class="container-fluid">
        <div class="custom-panel">
            <div class="panel-head">
                <h1 class="panel-head-text">Manage Exclusion</h1>
            </div>
            <div class="panel-body">
                    <div class="row mt25">
                        <div class="col-md-2 col-sm-6 col-xs-12">
                            <div class="form-group custom-form-group department-filter-box">
                                <label>Source: <span class="text-red">*</span></label>
                                <select id="SourceMaster" class="form-control" multiple="multiple">
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6 col-xs-12">
                            <div class="form-group custom-form-group">
                                <label>Exclusion: <span class="text-red">*</span></label>
                                <input type="text" class="form-control" name="" placeholder="Enter Exclusion" id="newExclusion">
                            </div>
                        </div>
                        <div class="col-md-1 col-sm-12 col-xs-12" id="add-button-box">
                            <div class="filter-button-area" data-toggle="modal" data-target="#alert-new-add">
                                <button type="button" class="btn custom-btn mt25 tmt0 wpx-90">Add</button>
                            </div>
                        </div>
                        <div class="col-md-1 col-sm-12 col-xs-12" hidden id="edit-button-box">
                            <div class="filter-button-area" data-toggle="modal" data-target="#alert-edit">
                                    <button type="button" class="btn custom-btn mt25 tmt0 wpx-90">Edit</button>
                                </div>
                            </div>
                    </div>
                    <div class="row mt15">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                                <table class="table mb0 custom-table">
                                    <thead>
                                        <tr>
                                            <th>Source</th>
                                            <th>Exclusion</th>
                                            <th class="w-1-th">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="exclusiondata">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="mt20 text-center">
                              <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSDashboard.aspx" type="button"
                                  class="btn custom-btn-two-cancel mr5 wpx-90">Close</a>
                        </div>
            </div>
        </div>
    </div>

    
    
    
    <div id="alert-new-add" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content reciprocal-custom-modal">
          <div class="modal-header">
             <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>
            <h4 class="modal-title">Alert</h4>
          </div>
          <div class="modal-body">
            <p class="font-18">Are you sure you want to add new record?</p>
          </div>
          <div class="modal-footer">
            <button class="btn custom-btn mr-8" data-dismiss="modal" id="add-data">Yes</button>
            <button class="btn custom-btn-two-cancel" data-dismiss="modal">No</button>
          </div>
        </div>

      </div>
    </div>
    
    <div id="alert-edit" class="modal fade" role="dialog">
          <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content reciprocal-custom-modal">
              <div class="modal-header">
                 <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>
                <h4 class="modal-title">Alert</h4>
              </div>
              <div class="modal-body">
                <p class="font-18">Are you sure you want to edit this record?</p>
              </div>
              <div class="modal-footer">
                <button class="btn custom-btn mr-8" data-dismiss="modal" id="edit-data">Yes</button>
                <button class="btn custom-btn-two-cancel" data-dismiss="modal">No</button>
              </div>
            </div>
          </div>
         </div>`

    this.bindevent();

  }

  private async bindevent() {
    this.fetchfromExclusionMaster();
    await this.fetchfromSourceMaster();
    this.domElement.querySelector('#add-data').addEventListener('click', () => {
      this.AddtoExclusionMaster();
    });
  }

  private async fetchfromExclusionMaster(): Promise<void> {

    const items = await sp.web.lists.getByTitle("ExclusionMaster").items.filter("Title ne 'Others'")
      .select("*,Source/Title").expand("Source").get();
    console.log(items)

    let table = ``

    for (let i = 0; i < items.length; i++) {
      table += `
  <tr>
  <td>${items[i].Source.map((val: any) => {
        return (val.Title)
      })}</td>
  <td>${items[i].Title}</td>
  <td>
            <div class="reciprocal-action-btn-box">
                  <a type="button" href="#" class="custom-edit-btn mr15" id="edit-data${i}">
                    <i class="fa fa-pencil"></i>
                  </a>
                  <a type="button" href="#" class="custom-edit-btn" id="delete-data${i}">
                    <i class="fa fa-trash"></i>
                  </a>
            </div>
  </td>
</tr>`

      $(document).on('click', '#delete-data' + i, async (): Promise<any> => {
        var deleteid: any = items[i].ID
        var deletename: any = items[i].Title
        let answer = window.confirm(`Do you want to delete (${deletename}) ?`);

        if (answer == true) {
          await this.DeleteDatafromExclusionMaster(deleteid);
          location.reload();
        }

      });

      $(document).on('click', '#edit-data' + i, async (): Promise<any> => {
        var editid: any = items[i].ID
        var editname: any = items[i].Title
        var sourceeditID: any = items[i].SourceId
        let answer = window.confirm(`Do you want to edit (${editname}) ?`);

        if (answer == true) {
          $("#newExclusion").val(editname);
          $("#SourceMaster").val(sourceeditID);
          ($('#SourceMaster') as any).multiselect('reload');


          $("#add-button-box").hide();
          $("#edit-button-box").show();
          this.domElement.querySelector('#edit-data').addEventListener('click', () => {
            this.EdittoExclusionMaster(editid);
          });
        }

      });




    }
    $("#exclusiondata").html(table);
  }

  private async fetchfromSourceMaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("SourceMaster").items.get();
    console.log(items.length);

    let events = ``

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('SourceMaster').innerHTML = events;
    ($('#SourceMaster') as any).multiselect({
      columns: 1,
      selectAllText: false,
      placeholder: 'Select Your Options',
      search: true,
      searchOptions: {
        'default': 'Search'
      },
      selectAll: true,
    });
  }


  private async AddtoExclusionMaster(): Promise<void> {

    const NewExclusion: any = $("#newExclusion").val();
    const SourceID: any = $("#SourceMaster").val();
    var error = null;
    console.log(NewExclusion)

    if (NewExclusion === "") {
      error = "Please Enter an Exclusion";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('ExclusionMaster').items.add({

        Title: NewExclusion,
        SourceId: { results: SourceID }
      })

        .then(_response => {
          alert(`(${NewExclusion}) added to the List`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }
  }


  private async EdittoExclusionMaster(numId: any): Promise<void> {

    const NewExclusion: any = $("#newExclusion").val();
    const SourceID: any = $("#SourceMaster").val();
    var error = null;
    console.log(NewExclusion)

    if (NewExclusion === "") {
      error = "Please Enter an Exclusion";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('ExclusionMaster').items.getById(numId).update({

        Title: NewExclusion,
        SourceId: { results: SourceID }
      })

        .then(_response => {
          alert(`(${NewExclusion}) edited to the List`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }

  }


  private async DeleteDatafromExclusionMaster(numId: any): Promise<void> {

    let list = await sp.web.lists.getByTitle("ExclusionMaster").items.getById(numId).delete();
     console.log(list)

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
