import { Version } from "@microsoft/sp-core-library";
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
//import { IReadonlyTheme } from '@microsoft/sp-component-base';
//import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
//import * as pnp from 'sp-pnp-js';
//import { sp, Web } from "@pnp/sp/presets/all"
//import styles from './IprsDashboardWebPart.module.scss';
import * as strings from "IprsDashboardWebPartStrings";
import { SPComponentLoader } from "@microsoft/sp-loader";
import "jquery";
require("bootstrap");
require("../../webparts/iprsDashboard/assets/assets/css/padding.css");
require("../../webparts/iprsDashboard/assets/assets/css/styles.css");

export interface IIprsDashboardWebPartProps {
    description: string;
}

export default class IprsDashboardWebPart extends BaseClientSideWebPart<IIprsDashboardWebPartProps> {
    // private _isDarkTheme: boolean = false;
    // private _environmentMessage: string = "";

    protected onInit(): Promise<void> {
        sp.setup(this.context as any);
        return super.onInit();
    }

    public async render(): Promise<void> {
        SPComponentLoader.loadCss(
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        );
        SPComponentLoader.loadCss(
            "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
        );
        this.domElement.innerHTML = `
<div class="container-fluid">
    <div class="custom-panel">
        <div class="panel-head">
            <h1 class="panel-head-text">Reciprocal Dashboard</h1>
        </div>
        <div class="panel-body">
            <div class="row m-0 mb15 mt25">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="scrollbar-panel chip-panel">
                        <div class="chip-box">
                            <div class="upload-chip">Buma</div>
                            <div class="upload-chip">Perf Right</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row m-0 mb5">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboard-new-panel-col-1">
                    <div class="dashboard-deta-btn-panel d-flex">
                        <div class="dropdown dashboard-table-btn">
                            <button class="btn dropdown-toggle" type="button" onclick="window.location.href='add.html'">
                                <img class="dashboard-icon-info mr2" src="assets/images/plus-icon.png" alt="plus">
                                <span>Add</span>
                            </button>
                        </div>
<!--
                        <div class="dropdown dashboard-table-btn">
                            <button class="btn dropdown-toggle" type="button" onclick="window.location.href='add.html'">
                                <img class="dashboard-icon-info mr2" src="assets/images/edit-property-icon.png" alt="plus">
                                <span>Modify</span>
                            </button>
                        </div>
-->
                        <div class="dropdown dashboard-table-btn" data-toggle="modal" data-target="#dashboard-filter">
                            <button class="btn dropdown-toggle" type="button">
                              <img class="dashboard-icon-info mr2" src="assets/images/filter-icon.png" alt="filter">
                              <span>Filter</span>
                            </button>
                        </div>
                        <div class="dropdown dashboard-table-btn">
                            <button class="btn dropdown-toggle" type="button" id="exportid">
                              <img class="dashboard-icon-info mr2" src="assets/images/export-icon.png" alt="export">
                              <span>Export</span>
                            </button>
                        </div>
                        <div class="dropdown dashboard-table-btn">
                            <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                              <img class="dashboard-icon-info mr2" src="assets/images/sort-icon.png" alt="sort">
                              <span>Sort</span>
                              <img class="dashboard-icon-info ml2" src="assets/images/expand-arrow-icon.png" alt="expand arrow">
                            </button>
                            <ul class="dropdown-menu dropdown-color-menu-icon">
                              <li>
                                <a href="#">
                                  <span>Society</span>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <span>Right</span>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <span>Source</span>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <span>Grant</span>
                                </a>
                              </li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group custom-form-group dashboard-search-box">
                        <input class="form-control" type="text" name="" placeholder="Search">
                    </div>
                </div>
            </div>
            <div class="row mt5">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                        <table class="table mb0 custom-table" id="data">
                            
                            
                        </table>
                    </div>
                </div>
            </div>
            <div class="mt10">
                    <div class="row">
                      <div class="col-sm-7 col-xs-12">
                        <ul class="pagination custom-pagination">
                          <li><a href="#"><i class="fa fa-angle-double-left"></i></a>
                          </li>
                          <li><a href="#"><i class="fa fa-angle-left"></i></a>
                          </li>
                          <li class="active"><a href="#">1</a></li>
                          <li><a href="#">2</a></li>
                          <li><a href="#">...</a></li>
                          <li><a href="#">5</a></li>
                          <li><a href="#"><i class="fa fa-angle-right"></i></a>
                          </li>
                          <li><a href="#"><i class="fa fa-angle-double-right"></i></a>
                          </li>
                        </ul>

                      </div>
                      <div class="col-sm-5 col-xs-12">
                        <div class="dms-table-total-items">
                          <label class="total-items">Showing 10 out of 25 Items |</label>
                        <a class="view-all-card-link" href="#">View all</a>
                        </div>
                      </div>
                    </div>
                  </div>
    </div>
    </div>
</div>




<div id="dashboard-filter" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content reciprocal-custom-modal">
      <div class="modal-header">
         <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>
        <h4 class="modal-title">Filter</h4>
      </div>
      <div class="modal-body">
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Society:</label>
                    <select id="society" name="society_basic[]" multiple="multiple" class="3col active form-control">
                        <option value="buma">Buma</option>
                        <option value="societyname1">Society Name 1</option>
                        <option value="societyname2">Society Name 2</option>
                        <option value="societyname3">Society Name 3</option>
                        <option value="societyname4">Society Name 4</option>
                    </select>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Right Type:</label>
                    <select class="form-control">
                        <option>Perf Right</option>
                        <option>Mech Right</option>
                        <option>Sync Right</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Source:</label>
                    <select class="form-control">
                        <option>Television Broadcasting</option>
                        <option>Internet Streaming</option>
                        <option>Radio Broadcasting</option>
                        <option>Public Performance</option>
                        <option>Physical Format</option>
                        <option>Lyric Display Right</option>
                        <option>Phonogram</option>
                        <option>Private Copying</option>
                    </select>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Grant:</label>
                    <select class="form-control">
                        <option>Exclusive</option>
                        <option>Non-Exclusive</option>
                        <option>Blank</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>From Date:</label>
                    <input type="date" class="form-control" name="">
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>To Date:</label>
                    <input type="date" class="form-control" name="">
                </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn custom-btn mr-8" data-dismiss="modal">Apply</button>
        <button class="btn custom-btn-two-cancel" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>

<div id="detail-modal" class="modal fade" role="dialog">
  <div class="modal-dialog modal-lg">

    <!-- Modal content-->
    <div class="modal-content reciprocal-custom-modal">
      <div class="modal-header">
        <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>
        <h4 class="modal-title">Details</h4>
      </div>
      <div class="modal-body">
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Society:</label>
                    <p>Buma</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Right Type:</label>
                    <p>Perf Right</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Source:</label>
                    <p>Television Broadcasting</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Grant:</label>
                    <p>Exclusive</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Inclusion:</label>
                    <p>Facebook</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Exclusion:</label>
                    <p>Youtube</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Valid From:</label>
                    <p>14-02-2023</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Valid To:</label>
                    <p>28-03-2023</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-12 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Remarks:</label>
                    <p>Lorem ipsum dolor sit amet do solor. Lorem ipsum dolor sit amet do solor. Lorem ipsum dolor sit amet do solor. </p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Created By:</label>
                    <div class="reciprocal-user-card-panel">
                        <div class="reciprocal-user-card-img">
                            <img src="assets/images/img-21.jpg" alt="user">
                        </div>
                        <div class="reciprocal-user-card-info">
                            <div class="reciprocal-user-card-name ellipsis-1">
                                Patrick Dawson
                            </div>
                            <div class="reciprocal-user-card-email ellipsis-1">
                                pat.dawson@mail-india.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Created On:</label>
                    <p>16-02-2023</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Modified By:</label>
                    <div class="reciprocal-user-card-panel">
                        <div class="reciprocal-user-card-img">
                            <img src="assets/images/1.png" alt="user">
                        </div>
                        <div class="reciprocal-user-card-info">
                            <div class="reciprocal-user-card-name ellipsis-1">
                                David Norman
                            </div>
                            <div class="reciprocal-user-card-email ellipsis-1">
                                dav.norman@mail-india.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Modified On:</label>
                    <p>01-03-2023</p>
                </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn custom-btn-two-cancel" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>

<div id="inclusionlist" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content reciprocal-custom-modal">
      <div class="modal-header">
         <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>
        <h4 class="modal-title">Add Inclusions</h4>
      </div>
      <div class="modal-body">
        <div class="checkbox">
           <label><input type="checkbox" value="">YouTube</label>
        </div>
        <div class="checkbox">
           <label><input type="checkbox" value="">Resso</label>
        </div>
        <div class="checkbox">
           <label><input type="checkbox" value="">LinkedIn</label>
        </div>
        <div class="checkbox">
           <label><input type="checkbox" value="">Facebook</label>
        </div>
        <div class="form-group custom-form-group wpx-250">
            <input type="text" class="form-control" name="" placeholder="custom text field">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90">Add</button>
      </div>
    </div>

  </div>
</div>



<div id="exclusionlist" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content reciprocal-custom-modal">
      <div class="modal-header">
         <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>
        <h4 class="modal-title">Add Exclusions</h4>
      </div>
      <div class="modal-body">
        <div class="checkbox">
           <label><input type="checkbox" value="">YouTube</label>
        </div>
        <div class="checkbox">
           <label><input type="checkbox" value="">Resso</label>
        </div>
        <div class="checkbox">
           <label><input type="checkbox" value="">LinkedIn</label>
        </div>
        <div class="checkbox">
           <label><input type="checkbox" value="">Facebook</label>
        </div>
        <div class="form-group custom-form-group wpx-250">
            <input type="text" class="form-control" name="" placeholder="custom text field">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90">Add</button>
      </div>
    </div>

  </div>
</div>
`;
        this.fetchfromIPRS();
    }

    private async fetchfromIPRS(): Promise<void> {
        const items = await sp.web.lists.getByTitle("IPRS")
        .items.select("Society/Title,RightType/Title,Source/Title,Grant/Title,*")
        .expand("Society,RightType,Source,Grant").get();
        console.log(items);

        let table = 
        `<thead>
        <tr>
            <th class="w-10-th">Society</th>
            <th class="w-10-th">Right</th>
            <th class="w-15-th">Source</th>
            <th class="w-10-th">Grant</th>
            <th class="w-5-th">Valid From</th>
            <th class="w-5-th">Valid Till</th>
            <th class="w-5-th">Action</th>
        </tr>
    </thead>`

    for(let i=0; i<items.length; i++)
table +=`
<tbody>
<td>${items[i].Society.Title}</td>     
<td>${items[i].RightType.Title}</td>     
<td>${items[i].Source.Title}</td>     
<td>${items[i].Grant.Title}</td>     
<td>${items[i].ValidFrom}</td>     
<td>${items[i].ValidTill}</td>
<td> <button id="delete${i}">Details</button></td>
</tbody>
`

document.getElementById('data').innerHTML = table;
    

   
//  this.domElement.querySelector('#').addEventListener('click', () => {     
//          this.exportfile();     
        
//  })
 
//  declare global {
//     interface Navigator {
//       msSaveOrOpenBlob: (blobOrBase64: Blob | string, filename: string) => void
//     }
//   }
//  private exportfile()
//  {

//     var downloadLink;
//     var dataType = 'application/vnd.ms-excel';
//     var tableSelect = document.getElementById("data");
//     var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    
//     // Create download link element
//     downloadLink = document.createElement("a");
    
//     document.body.appendChild(downloadLink);
 
//     if (navigator.msSaveOrOpenBlob){
//         var blob = new Blob(['\ufeff', tableHTML], {
//             type: dataType
//         });
//         //navigator.msSaveOrOpenBlob ( blob, filename);
//     }else{
//         // Create a link to the file
//         downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        
//         //triggering the function
//         downloadLink.click();
//    }
//}



}

    protected get dataVersion(): Version {
        return Version.parse("1.0");
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription,
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField("description", {
                                    label: strings.DescriptionFieldLabel,
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
