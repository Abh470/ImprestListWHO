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
import * as strings from 'AdminInclusionWebPartStrings';


require("bootstrap");
require("../../webparts/CommonAssets/assets/css/padding.css");
require("../../webparts/CommonAssets/assets/css/styles.css");
require("../../webparts/CommonAssets/Style.css");
require("../../webparts/CommonAssets/Common.js");
require("../../webparts/CommonAssets/assets/css/jquery.multiselect.css");
require("../../webparts/CommonAssets/assets/js/jquery.multiselect.js");
const IprsLogo: any = require("../../webparts/CommonAssets/assets/images/IPRS-logo.png");


export interface IAdminInclusionWebPartProps {
  description: string;
}

export default class AdminInclusionWebPart extends BaseClientSideWebPart<IAdminInclusionWebPartProps> {

  protected onInit(): Promise<void> {
    sp.setup(this.context as any);
    return super.onInit();
  }

  public CustomFieldGlobalName: any = "Others";
  public oldInclusion: any = '';
  public IsAdmin: boolean = false;

  public async render(): Promise<void> {

    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    //SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    // SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js");


    let groups: [] = await sp.web.currentUser.groups();
    console.log(groups)
    groups.forEach((group: any) => {
      if (group.Title == "IPRS_Admin") {
        this.IsAdmin = true;
        return false;
      }
    });
    if (this.IsAdmin == true) {

      console.log("Admin")
    }
    else {
      alert("Sorry, you are not allowed to access this page");
      window.location.href = `${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSDashboard.aspx`;

    }

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
                <h1 class="panel-head-text">Manage Inclusion</h1>
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
                                <label>Inclusion: <span class="text-red">*</span></label>
                                <input type="text" class="form-control" name="" placeholder="Enter Inclusion" id="newInclsuion">
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
                            <div class="col-md-1 col-sm-12 col-xs-12" hidden id="cancel-button-box">
                               <div class="filter-button-area">
                                    <button type="button" class="btn custom-btn mt25 tmt0 wpx-90" id="cancel-reload-btn">Cancel</button>
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
                                            <th>Inclusion</th>
                                            <th class="w-1-th">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="inclusiondata">
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
                <button class="btn custom-btn mr-8" data-dismiss="modal" id="edit-data-modal">Yes</button>
                <button class="btn custom-btn-two-cancel" data-dismiss="modal">No</button>
              </div>
            </div>
          </div>
         </div>`

    this.bindevent();

  }

  private async bindevent() {

    this.fetchfromInclusionMaster();
    await this.fetchfromSourceMaster();
    this.domElement.querySelector('#add-data').addEventListener('click', () => {
      this.AddtoInclusionMaster();
    });
  }

  private async fetchfromInclusionMaster(): Promise<void> {

    const items = await sp.web.lists.getByTitle("InclusionMaster").items.filter(`Title ne '${this.CustomFieldGlobalName}'`)
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
          <a type="button" href="#" class="custom-edit-btn mr15" id="edit-data-modal${i}">
              <i class="fa fa-pencil"></i>
          </a>
          <a type="button" href="#" class="custom-edit-btn" id="delete-data${i}">
                  <i class="fa fa-trash"></i>
          </a>
      </div>
  </td>
</tr>`


      $(document).on('click', '#delete-data' + i, async (): Promise<any> => {
        var deleteInclusionId: any = items[i].ID
        var deleteInclusionName: any = items[i].Title
        let answer = window.confirm(`Do you want to delete (${deleteInclusionName}) ?`);

        if (answer == true) {
          await this.DeleteDatafromInclusionMaster(deleteInclusionId);
          location.reload();
        }

      });

      $(document).on('click', '#edit-data-modal' + i, async (): Promise<any> => {
        var editInclusionid: any = items[i].ID
        var editInclusionName: any = items[i].Title
        var sourceEditId: any = items[i].SourceId
        let answer = window.confirm(`Do you want to edit (${editInclusionName}) ?`);

        if (answer == true) {
          this.oldInclusion = editInclusionName;
          $("#newInclsuion").val(editInclusionName);
          $("#SourceMaster").val(sourceEditId);
          ($('#SourceMaster') as any).multiselect('reload');


          $("#add-button-box").hide();
          $("#edit-button-box").show();
          $("#cancel-button-box").show();

          this.domElement.querySelector('#cancel-reload-btn').addEventListener('click', () => {
            location.reload();
          });

          this.domElement.querySelector('#edit-data-modal').addEventListener('click', () => {
            this.EdittoInclusionMaster(editInclusionid);
          });
        }

      });



    }
    $("#inclusiondata").html(table);

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


  private async AddtoInclusionMaster(): Promise<void> {

    const NewInclusion: any = $("#newInclsuion").val();
    const SourceID: any = $("#SourceMaster").val();
    console.log(SourceID)
    var error = null;
    console.log(NewInclusion)
    if (SourceID.length === 0) {
      error = "Please select a Source"
      alert(error);
    }
    else if (NewInclusion === "") {
      error = "Please Enter an Inclusion";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('InclusionMaster').items.add({

        Title: NewInclusion,
        SourceId: { results: SourceID }
      })

        .then(_response => {
          alert(`(${NewInclusion}) added.`);
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }
  }


  private async EdittoInclusionMaster(numId: any): Promise<void> {

    const NewInclusion: any = $("#newInclsuion").val();
    const SourceID: any = $("#SourceMaster").val();
    var error = null;
    console.log(NewInclusion)

    if (NewInclusion === "") {
      error = "Please Enter an Inclusion";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('InclusionMaster').items.getById(numId).update({

        Title: NewInclusion,
        SourceId: { results: SourceID }
      })

        .then(_response => {
          alert(`(${this.oldInclusion}) replaced with (${NewInclusion})`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }

  }


  private async DeleteDatafromInclusionMaster(numId: any): Promise<void> {

    let list = await sp.web.lists.getByTitle("InclusionMaster").items.getById(numId).delete();
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

