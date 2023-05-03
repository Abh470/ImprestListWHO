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
import * as strings from 'AdminSourceWebPartStrings';


require("bootstrap");
require("../../webparts/CommonAssets/assets/css/padding.css");
require("../../webparts/CommonAssets/assets/css/styles.css");
require("../../webparts/CommonAssets/Style.css");
require("../../webparts/CommonAssets/Common.js");
//require("../../webparts/CommonAssets/assets/font-awesome/css/font-awesome.min.css");

const IprsLogo: any = require("../../webparts/CommonAssets/assets/images/IPRS-logo.png");

export interface IAdminSourceWebPartProps {
  description: string;
}

export default class AdminSourceWebPart extends BaseClientSideWebPart<IAdminSourceWebPartProps> {

  protected onInit(): Promise<void> {
    sp.setup(this.context as any);
    return super.onInit();
  }

  public CustomFieldGlobalName: any = "Others";

  public async render(): Promise<void> {

    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    //SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js");
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
                    <h1 class="panel-head-text">Manage Source</h1>
                </div>
                <div class="panel-body">
                        <div class="row mt25">
                            <div class="col-md-2 col-sm-6 col-xs-12">
                                <div class="form-group custom-form-group">
                                    <label>Source: <span class="text-red">*</span></label>
                                    <input type="text" class="form-control" name="" placeholder="Enter Source" id="newsource"> 
                                </div>
                            </div>
                            <div class="col-md-1 col-sm-12 col-xs-12" id="add-button-box">
                                <div class="filter-button-area">
                                    <button type="button" class="btn custom-btn mt25 tmt0 wpx-90" data-toggle="modal" data-target="#alert-new-add-source">Add</button>
                                </div>
                            </div>
                            <div class="col-md-1 col-sm-12 col-xs-12" hidden id="edit-button-box">
                               <div class="filter-button-area">
                                    <button type="button" class="btn custom-btn mt25 tmt0 wpx-90" data-toggle="modal" data-target="#alert-edit-source">Edit</button>
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
                                                <th class="w-1-th">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="sourcedata">
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
        
        
        
        <div id="alert-new-add-source" class="modal fade" role="dialog">
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
        
        <div id="alert-edit-source" class="modal fade" role="dialog">
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

    this.fetchfromSourceMaster();

    this.domElement.querySelector('#add-data').addEventListener('click', () => {
      this.AddtoSourceMaster();
    });

  }

  private async fetchfromSourceMaster(): Promise<void> {
    const items: any[] = await sp.web.lists.getByTitle("SourceMaster").items.get();
    console.log(items.length)
    console.log()

    let table = ``

    for (let i = 0; i < items.length; i++) {
      table += `
              <tr>
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
          this.DeleteDatafromSourceMaster(deleteid);
          location.reload();
        }

      });


      $(document).on('click', '#edit-data' + i, async (): Promise<any> => {
        var editid: any = items[i].ID
        var editname: any = items[i].Title
        let answer = window.confirm(`Do you want to edit (${editname}) ?`);

        if (answer == true) {
          $("#newsource").val(editname);
          $("#add-button-box").hide();
          $("#edit-button-box").show();
          this.domElement.querySelector('#edit-data').addEventListener('click', () => {
            this.EdittoSourceMaster(editid);
          });
        }

      });

    }
    //$("#sourcedata").html(table);
    $("#sourcedata").html(table);
  }

  private async AddtoSourceMaster(): Promise<void> {

    const NewSource: any = $("#newsource").val();
    var error = null;
    console.log(NewSource)

    if (NewSource === "") {
      error = "Please Enter a Source";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('SourceMaster').items.add({

        Title: NewSource
      })

        .then(async (response) => {
          //console.log(response.data.Id)
          let IDs = await sp.web.lists.getByTitle('SourceMaster').items.select('ID').get()
            const sourceIds = IDs.map(item => item['ID']);
            console.log(sourceIds);
      
          let itemsInclusion = await sp.web.lists.getByTitle('InclusionMaster').items.filter(`Title eq '${this.CustomFieldGlobalName}'`).get();
          if (itemsInclusion.length > 0) {
            const itemIdInclusion = itemsInclusion[0].ID; 
           await sp.web.lists.getByTitle('InclusionMaster').items.getById(itemIdInclusion).update({

              SourceId: { results: sourceIds }
            })
           
            }

            let itemsExclusion = await sp.web.lists.getByTitle('ExclusionMaster').items.filter(`Title eq '${this.CustomFieldGlobalName}'`).get();
          if (itemsExclusion.length > 0) {
            const itemIdExclusion = itemsExclusion[0].ID; 
           await sp.web.lists.getByTitle('ExclusionMaster').items.getById(itemIdExclusion).update({

              SourceId: { results: sourceIds }
            })
           
            }


          alert(`(${NewSource}) added to the List`) 
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }

  }

  private async EdittoSourceMaster(numId: any): Promise<void> {

    const NewSource: any = $("#newsource").val();
    var error = null;
    console.log(NewSource)

    if (NewSource === "") {
      error = "Please Enter a Source";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('SourceMaster').items.getById(numId).update({

        Title: NewSource
      })

        .then(_response => {
          alert(`(${ NewSource }) edited to the List`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }

  }

  private async DeleteDatafromSourceMaster(numId: any): Promise<void> {

    let list = sp.web.lists.getByTitle("SourceMaster");

    await list.items.getById(numId).delete();

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
