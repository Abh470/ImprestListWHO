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
require("../../webparts/CommonAssets/Style.css");
require("../../webparts/CommonAssets/Common.js");
//require("../../webparts/iprsDashboard/assets/assets/font-awesome/css/font-awesome.min.css");
require("../../webparts/iprsDashboard/assets/assets/js/jquery.multiselect.js");
require("../../webparts/iprsDashboard/assets/assets/css/jquery.multiselect.css");
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

  public APIDataFilter: any[];
  public APIDataForFilterSort: any[];
  public modalHTMLDetails = ``;
  public modalHTMLFilter = ``;
  //const IsFilterApplied : any[]; 

  public async render(): Promise<void> {
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    SPComponentLoader.loadCss("https://cdn.datatables.net/1.13.1/css/jquery.dataTables.min.css");
    SPComponentLoader.loadScript("https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js");
    //SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js");
    //SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js");



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
                            <button class="btn dropdown-toggle" type="button" id="addnew">
                                <img class="dashboard-icon-info mr2" src="${ADDUploaded}" alt="plus">
                                <span>Add</span>
                            </button>
                        </div>
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
                        
                            <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" id="sortId">
                              <img class="dashboard-icon-info mr2" src="${SortUploaded}" alt="sort">
                              <span>Sort</span>
                              <img class="dashboard-icon-info ml2" src="${ExpandArrowUploaded}" alt="expand arrow">
                              <select class="form-control">
                              <option value="">Society</option>
                              <option value="">Right</option>
                              <option value="">Source</option>
                              <option value="">Grant</option>
                              </select>
                            </button>
                            
                        </div>
                    </div>
                    <div class="form-group custom-form-group dashboard-search-box">
                        <input class="form-control" type="text" id="searchInput" name="" placeholder="Search">
                    </div>
                </div>
            </div>
            <div class="row mt5">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                        <table class="table mb0 custom-table" id="tableId">
                        <thead>
        <tr>
            <th class="w-10-th">Society</th>
            <th class="w-10-th">Right</th>
            <th class="w-15-th">Source</th>
            <th class="w-10-th">Grant</th>
            <th class="w-5-th">Valid From</th>
            <th class="w-5-th">Valid Till</th>
            <th class="w-5-th">Action</th>
        </tr>
    </thead>
    <tbody id="data">
    </tbody>
                            
                            
                        </table>
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
<div id ="modal-list-collection-details">
</div>
`
    this.fetchfromIPRS();
    this.fetchfromSocietyMaster();
    //this.societymultiselect();
    this.fetchfromRightTypeMaster();
    this.fetchfromSourceMaster();
    this.fetchfromGrantMaster();
    //this.FilterAPIData();
    //this.SortAPIData();
    this.domElement.querySelector('#exportid').addEventListener('click', () => {
      this.exportfile();
    });
    this.searchfunction();
    

    // this.domElement.querySelector('#addnew').addEventListener('click', () => {
    //   window.location.href = `${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSAddForm.aspx?mode=New`

    // });

    this.domElement.querySelector('#addnew').addEventListener('click', () => {
      window.location.href = `${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSAddForm.aspx?mode=New`
    });

   






  }

  //fetchfromsocietymaster
  private async fetchfromSocietyMaster(): Promise<void> {
    const items: any[] = await sp.web.lists
      .getByTitle("SocietyMaster")
      .items.get();
    console.log(items);

    var fetch = ``

    for (var i = 0; i < items.length; i++) {
      fetch += `<option value= ${items[i].ID}> ${items[i].Title} </option>`;
      console.log(items[i].Title)
    }

    document.getElementById("society").innerHTML = fetch;
    $(function() {
      ($('#society')as any).multiselect({
          columns: 1,
          selectAllText:false,
          placeholder: 'Society Name',
          search: true,
          searchOptions: {
              'default': 'Search'
          },
        selectAll: true,
        });
  
    });

  }

  //societymultiselect



  //fetchfromRightTypeMaster

  private async fetchfromRightTypeMaster(): Promise<void> {
    const items: any[] = await sp.web.lists
      .getByTitle("RightTypeMaster")
      .items.get();
    console.log(items);

    var fetch = ``

    for (var i = 0; i < items.length; i++) {
      fetch += `<option value= ${items[i].ID}> ${items[i].Title} </option>`;
      console.log(items[i].Title)
    }

    document.getElementById("righttype").innerHTML = fetch;
  }


  //fetchfromSourceMaster

  private async fetchfromSourceMaster(): Promise<void> {
    const items: any[] = await sp.web.lists
      .getByTitle("SourceMaster")
      .items.get();
    console.log(items.length);

    var fetch = ``
    for (var i = 0; i < items.length; i++) {
      fetch += `<option value= ${items[i].ID}> ${items[i].Title} </option>`;
      console.log(items[i].Title)
    }
    document.getElementById("source").innerHTML = fetch;
  }



  //fetchfromGrantMaster
  private async fetchfromGrantMaster(): Promise<void> {
    const items: any[] = await sp.web.lists
      .getByTitle("GrantMaster")
      .items.get();
    console.log(items.length);

    var fetch = ``
    for (var i = 0; i < items.length; i++) {
      fetch += `<option value= ${items[i].ID}> ${items[i].Title} </option>`;
      console.log(items[i].Title)
    }
    document.getElementById("grant").innerHTML = fetch;
  
  }







  //fetchfromIPRS
  private async fetchfromIPRS(): Promise<void> {
    const items = await sp.web.lists.getByTitle("IPRS")
      .items.select("Society/Title,RightType/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,Author/Title,Author/Id,Editor/Title,Editor/Id,*")
      .expand("Society,RightType,Source,Grant,Inclusion,Exclusion,Author,Editor").get();
    console.log(items);
    

    let table =``

    for (let i = 0; i < items.length; i++) {
      
      let CreatedByMail =''
     await sp.web.siteUsers.getById(items[i].AuthorId).get()
    .then(user => { 
      console.log('Email ID: ', user.Email);
      CreatedByMail = user.Email;
     });

     let ModifiedByMail=''
     await sp.web.siteUsers.getById(items[i].EditorId).get()
    .then(user => { 
      console.log('Email ID: ', user.Email);
      ModifiedByMail = user.Email;
     });
      
     table += `
 <tr>     
<td>${items[i].Society.Title}</td>
<td>${items[i].RightType.Title}</td>
<td>${items[i].Source.Title}</td>
<td>${items[i].Grant.Title}</td>
<td>${items[i].ValidFrom}</td>
<td>${items[i].ValidTill}</td>
<td> 
<div class="reciprocal-action-btn-box">
<a type="button" href="#" class="btn custom-btn custom-btn-two" data-toggle="modal" data-target="#detail-modal${i}">Details</a>
</div>
</td>
</tr>
`

      {
        this.modalHTMLDetails += `<div id="detail-modal${i}" class="modal fade" role="dialog">
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
                    <p>${items[i].Society.Title}</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Right Type:</label>
                    <p>${items[i].RightType.Title}</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Source:</label>
                    <p>${items[i].Source.Title}</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Grant:</label>
                    <p>${items[i].Grant.Title}</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Inclusion:</label>
                    <p>${items[i].Inclusion.map((val: any) => {
          return (val.Title)
        })}</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Exclusion:</label>
                    <p>${items[i].Exclusion.map((val: any) => {
          return (val.Title)
        })}</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Valid From:</label>
                    <p>${items[i].ValidFrom}</p>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Valid To:</label>
                    <p>${items[i].ValidTill}</p>
                </div>
            </div>
        </div>
        <div class="row mt10">
            <div class="col-sm-12 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Remarks:</label>
                    <p>${items[i].Remarks}</p>
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
                            ${items[i].Author.Title}
                            </div>
                            <div class="reciprocal-user-card-email ellipsis-1">
                            ${CreatedByMail}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Created On:</label>
                    <p>${items[i].Created}</p>
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
                            ${items[i].Editor.Title}
                            </div>
                            <div class="reciprocal-user-card-email ellipsis-1">
                            ${ModifiedByMail}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Modified On:</label>
                    <p>${items[i].Modified}</p>
                </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn custom-btn-two-cancel" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>`

      }




      
      document.getElementById('modal-list-collection-details').innerHTML = this.modalHTMLDetails;
    }
    document.getElementById('data').innerHTML = table;
    ($("#tableId") as any).DataTable({
      items: 100,
      itemsOnPage: 10,
      cssStyle: 'light-theme',
      scrollY:'500px',
      scrollX:true,
      sScrollXInner: "100%",
      //bFilter: false
  });
  }

  private async exportfile(): Promise<void> {
    var htmltable = document.getElementById('data');
    var html = htmltable.outerHTML;
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
  }








  // private forselectedSociety() {   $("#society").change(function() {   
  //     var selectedSociety = $('#society option:selected', this).val();    
  //     console.log(selectedSociety)});
  // }



  // private FilterAPIData() {
  //     let filterSociety = $("#subject-having").val();
  //     let filterRightType = $("#righttype").val();
  //    // let filterSource = $("#source").val();
  //     // let filterGrant = $("#grant").val();

  //     this.APIDataFilter = this.APIDataForFilterSort;

  //     if (filterSociety != "" || filterRightType != "") {
  //         this.APIDataFilter = this.APIDataForFilterSort.filter(function (el) {
  //         let sub = el.subject.toUpperCase();
  //         let RightType = el.RightType.emailAddress.name.toUpperCase();
  //         return sub.includes(filterSociety.toUpperCase()) && RightType.includes(filterRightType.toUpperCase())
  //       });
  //     }
  //     if (filterSociety == "Having Attachments") {
  //         this.APIDataFilter = this.APIDataFilter.filter(function (el) {
  //         return el.hasAttachments === true;
  //       })
  //     }
  //     else if (filterSociety == "without Attachments") {
  //         this.APIDataFilter = this.APIDataFilter.filter(function (el) {
  //         return el.hasAttachments === false;
  //       })
  //     } 
  //     this.AppendFilterandSortingHTML(this.APIDataFilter);
  //      const IsFilterApplied = true;
  // }

  // private async SortAPIData(SortByName: string) {
  //   let APIDataSort;
  //   if (IsFilterApplied) {
  //     APIDataSort = this.APIDataFilter
  //   }
  //   APIDataSort = this.APIDataForFilterSort;
  //   APIDataSort.sort(function (a, b) {
  //     if (SocietyMaster == "By Subject") {
  //       if (a.subject < b.subject) { return -1; }
  //       if (a.subject > b.subject) { return 1; }
  //       return 0;
  //     }
  //     else if (SortByName == "By RightType") {
  //       if (a.RightType.emailAddress.name < b.RightType.emailAddress.name) { return -1; }
  //       if (a.RightType.emailAddress.name > b.RightType.emailAddress.name) { return 1; }
  //       return 0;
  //     }
  //     else if (SortByName == "By Date") {
  //       if (a.sentDateTime > b.sentDateTime) { return -1; }
  //       if (a.sentDateTime < b.sentDateTime) { return 1; }
  //       return 0;
  //     }
  //   })
  //   //console.log(APIDataSort);
  //   this.AppendFilterandSortingHTML(APIDataSort);
  // }





  private searchfunction() {

    $("#searchInput").on("keyup", function () {
      var value: any = $(this).val().toString().toLowerCase();
      $("#data tr").filter(function (): any {
        $(this).toggle($(this).text()
          .toLowerCase().indexOf(value) > -1)
      });
    });

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

