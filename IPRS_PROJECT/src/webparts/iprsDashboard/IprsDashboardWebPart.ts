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
require("../../webparts/CommonAssests/Style.css");
require("../../webparts/CommonAssests/Common.js");
const ADDUploaded: any = require('../../webparts/iprsDashboard/assets/assets/images/plus-icon.png');
const filterUploaded: any = require('../../webparts/iprsDashboard/assets/assets/images/filter-icon.png');
const ExportUploaded: any = require('../../webparts/iprsDashboard/assets/assets/images/export-icon.png');
const SortUploaded: any = require('../../webparts/iprsDashboard/assets/assets/images/sort-icon.png');
const ExpandArrowUploaded: any = require('../../webparts/iprsDashboard/assets/assets/images/expand-arrow-icon.png');
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

    public APIDataFilter : any[];
    public APIDataForFilterSort : any[]; 
    const IsFilterApplied : any[]; 

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
                                <img class="dashboard-icon-info mr2" src="${ADDUploaded}" alt="plus">
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
                              <img class="dashboard-icon-info mr2" src="${filterUploaded}" alt="filter">
                              <span>Filter</span>
                            </button>
                        </div>
                        <div class="dropdown dashboard-table-btn">
                            <button class="btn dropdown-toggle" type="button" id="exportid">
                              <img class="dashboard-icon-info mr2" src="${ExportUploaded}" alt="export">
                              <span>Export</span>
                            </button>
                        </div>
                        <div class="dropdown dashboard-table-btn">
                            <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                              <img class="dashboard-icon-info mr2" src="${SortUploaded}" alt="sort">
                              <span>Sort</span>
                              <img class="dashboard-icon-info ml2" src="${ExpandArrowUploaded}" alt="expand arrow">
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
                    <select id="society" name="society_basic[]" multiple="multiple" class="form-control">
                        
                    </select>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Right Type:</label>
                    <select id="righttype" class="form-control">

                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Source:</label>
                    <select id="source"class="form-control">
                        
                    </select>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Grant:</label>
                    <select id="grant"class="form-control">
                        
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

    </div>



</div>
`;
        this.fetchfromIPRS();
        this.fetchfromSocietyMaster();
        this.fetchfromRightTypeMaster();
        this.fetchfromSourceMaster();
        this.fetchfromGrantMaster();
       this.FilterAPIData();
       this.domElement.querySelector('#exportid').addEventListener('click', () => {     
            this.exportfile();     
            }) 
    
    } 
    
    //fetchfromsocietymaster
    private async fetchfromSocietyMaster(): Promise<void> {
        const items: any[] = await sp.web.lists
          .getByTitle("SocietyMaster")
          .items.get();
        console.log(items);
        
    var fetch = ``

        for (var i = 0; i < items.length; i++) {
           fetch +=`<option value= ${items[i].ID}> ${items[i].Title} </option>`;
           console.log(items[i].Title)
        }
        
        document.getElementById("society").innerHTML=fetch;
      }
    

      //fetchfromRightTypeMaster
    
      private async fetchfromRightTypeMaster(): Promise<void> {
        const items: any[] = await sp.web.lists
          .getByTitle("RightTypeMaster")
          .items.get();
        console.log(items);
        
    var fetch = ``

        for (var i = 0; i < items.length; i++) {
           fetch +=`<option value= ${items[i].ID}> ${items[i].Title} </option>`;
           console.log(items[i].Title)
        }
        
        document.getElementById("righttype").innerHTML=fetch;
      }


      //fetchfromSourceMaster

      private async fetchfromSourceMaster(): Promise<void> {
        const items: any[] = await sp.web.lists
          .getByTitle("SourceMaster")
          .items.get();
        console.log(items.length);
     
      var fetch =``
        for (var i = 0; i < items.length; i++) {
         fetch +=`<option value= ${items[i].ID}> ${items[i].Title} </option>`;
         console.log(items[i].Title)
        }
        document.getElementById("source").innerHTML=fetch;
      }



//fetchfromGrantMaster
      private async fetchfromGrantMaster(): Promise<void> {
        const items: any[] = await sp.web.lists
          .getByTitle("GrantMaster")
          .items.get();
        console.log(items.length);
     
      var fetch =``
        for (var i = 0; i < items.length; i++) {
         fetch +=`<option value= ${items[i].ID}> ${items[i].Title} </option>`;
         console.log(items[i].Title)
        }
        document.getElementById("grant").innerHTML=fetch;
      }




       //fetchfromIPRS
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
    {
table +=`
<tbody>
<td>${items[i].Society.Title}</td>
<td>${items[i].RightType.Title}</td>
<td>${items[i].Source.Title}</td>
<td>${items[i].Grant.Title}</td>
<td>${items[i].ValidFrom}</td>
<td>${items[i].ValidTill}</td>
<td> <div class="reciprocal-action-btn-box">
<a href="#" class="btn custom-btn custom-btn-two" data-toggle="modal" data-target="#detail-modal">Details</a>
</div></td>
</tbody>
`
document.getElementById('data').innerHTML = table;  
}   
}

private async exportfile(): Promise<void> {
    var htmltable= document.getElementById('data');
       var html = htmltable.outerHTML;
       window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
    }





        

// private forselectedSociety() {   $("#society").change(function() {   
//     var selectedSociety = $('#society option:selected', this).val();    
//     console.log(selectedSociety)});
// }



private FilterAPIData() {
    let filterSociety = $("#subject-having").val();
    let filterRightType = $("#righttype").val();
   // let filterSource = $("#source").val();
    // let filterGrant = $("#grant").val();
  
    this.APIDataFilter = this.APIDataForFilterSort;
    
    if (filterSociety != "" || filterRightType != "") {
        this.APIDataFilter = this.APIDataForFilterSort.filter(function (el) {
        let sub = el.subject.toUpperCase();
        let RightType = el.RightType.emailAddress.name.toUpperCase();
        return sub.includes(filterSociety.toUpperCase()) && RightType.includes(filterRightType.toUpperCase())
      });
    }
    if (filterSociety == "Having Attachments") {
        this.APIDataFilter = this.APIDataFilter.filter(function (el) {
        return el.hasAttachments === true;
      })
    }
    else if (filterSociety == "without Attachments") {
        this.APIDataFilter = this.APIDataFilter.filter(function (el) {
        return el.hasAttachments === false;
      })
    } 
    this.AppendFilterandSortingHTML(this.APIDataFilter);
     IsFilterApplied = true;
}

  private async SortAPIData(SortByName) {
    let APIDataSort;
    if (IsFilterApplied) {
      APIDataSort = this.APIDataFilter
    }
    APIDataSort = this.APIDataForFilterSort;
    APIDataSort.sort(function (a, b) {
      if (SocietyMaster == "By Subject") {
        if (a.subject < b.subject) { return -1; }
        if (a.subject > b.subject) { return 1; }
        return 0;
      }
      else if (SortByName == "By RightType") {
        if (a.RightType.emailAddress.name < b.RightType.emailAddress.name) { return -1; }
        if (a.RightType.emailAddress.name > b.RightType.emailAddress.name) { return 1; }
        return 0;
      }
      else if (SortByName == "By Date") {
        if (a.sentDateTime > b.sentDateTime) { return -1; }
        if (a.sentDateTime < b.sentDateTime) { return 1; }
        return 0;
      }
    })
    //console.log(APIDataSort);
    this.AppendFilterandSortingHTML(APIDataSort);
  }




   
 
 







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

