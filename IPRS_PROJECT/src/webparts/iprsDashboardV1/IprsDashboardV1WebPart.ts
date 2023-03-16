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
import * as moment from "moment";
import * as _ from "lodash";

require("bootstrap");
require("../../webparts/iprsDashboardV1/assets/assets/css/padding.css");
require("../../webparts/iprsDashboardV1/assets/assets/css/styles.css");
require("../../webparts/CommonAssets/Style.css");
require("../../webparts/CommonAssets/Common.js");
//require("../../webparts/iprsDashboard/assets/assets/font-awesome/css/font-awesome.min.css");
require("../../webparts/iprsDashboardV1/assets/assets/js/jquery.multiselect.js");
require("../../webparts/iprsDashboardV1/assets/assets/css/jquery.multiselect.css");

require("../../webparts/CommonAssets/ExcelJs/jquery.table2excel.js");
const ADDUploaded: any = require('../../webparts/iprsDashboardV1/assets/assets/images/plus-icon.png');
const filterUploaded: any = require('../../webparts/iprsDashboardV1/assets/assets/images/filter-icon.png');
const ExportUploaded: any = require('../../webparts/iprsDashboardV1/assets/assets/images/export-icon.png');

import * as strings from 'IprsDashboardV1WebPartStrings';

export interface IIprsDashboardV1WebPartProps {
  description: string;
}

export default class IprsDashboardV1WebPart extends BaseClientSideWebPart<IIprsDashboardV1WebPartProps> {

  protected onInit(): Promise<void> {
    sp.setup(this.context as any);
    return super.onInit();
  }

  public APIDataFilter: any[];
  public APIDataForFilterSort: any[];
  public modalHTMLDetails = ``;
  public modalHTMLFilter = ``;
  public modalHTMLHistory = ``;
  public IsFilterApplied: boolean = false;


  public async render(): Promise<void> {
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    SPComponentLoader.loadCss("https://cdn.datatables.net/1.13.3/css/jquery.dataTables.min.css");
    SPComponentLoader.loadScript("https://cdn.datatables.net/1.13.3/js/jquery.dataTables.min.js");
    //SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
    //SPComponentLoader.loadScript("src/jquery.table2excel.js");


    this.domElement.innerHTML = `
    <div class="lds-dual-ring-box"> <div class="lds-dual-ring"></div> </div>
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
                        ${/* 
                             // Backtick Comment    
                        <div class="dropdown dashboard-table-btn">
                        
                            <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" id="sortId">
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
                        </div> */''}
                    </div>
                    ${/*<div class="form-group custom-form-group dashboard-search-box">
                        <input class="form-control" type="text" id="searchInput" name="" placeholder="Search">
                    </div>*/''}
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
            <th class="w-5-th noExl" >Action</th>
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
                    <span style="color:red;" class="MandSign">*</span>
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
                    <span style="color:red;" class="MandSign">*</span>
                    <input type="date" class="form-control" name="" id="Fromdatefilter">
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>To Date:</label>
                    <span style="color:red;" class="MandSign">*</span>
                    <input type="date" class="form-control" name="" id="Todatefilter">
                </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn custom-btn mr-8" data-dismiss="modal" id="filterbutton" >Apply</button>
        <button class="btn custom-btn-two-cancel" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>
<div id ="modal-list-collection-details">
</div>
<div id ="modal-list-collection-history">
</div>
`

    this.fetchfromSocietyMaster();
    //this.societymultiselect();
    this.fetchfromRightTypeMaster();
    this.fetchfromSourceMaster();
    this.fetchfromGrantMaster();
    this.fetchfromIPRS("").then(() => {
      $(".lds-dual-ring").hide();
    })

    //this.SortAPIData();
    this.domElement.querySelector('#exportid').addEventListener('click', () => {
      this.exportfile();
    });

    this.domElement.querySelector('#filterbutton').addEventListener('click', () => {
      $(".lds-dual-ring").show();
      this.FilterAPIData();
    });
    //this.searchfunction();


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
    // $(function () {
    //   ($('#society') as any).multiselect({
    //     columns: 1,
    //     selectAllText: false,
    //     placeholder: 'Select Your Options',
    //     search: true,
    //     searchOptions: {
    //       'default': 'Search'
    //     },
    //     selectAll: true,
    //   });

    // });

  }

  //societymultiselect



  //fetchfromRightTypeMaster

  private async fetchfromRightTypeMaster(): Promise<void> {
    const items: any[] = await sp.web.lists
      .getByTitle("RightTypeMaster")
      .items.get();
    console.log(items);

    var fetch = `<option value="" disabled selected>Select your option</option>`

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

    var fetch = `<option value="" disabled selected>Select your option</option>`
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

    var fetch = `<option value="" disabled selected>Select your option</option>`
    for (var i = 0; i < items.length; i++) {
      fetch += `<option value= ${items[i].ID}> ${items[i].Title} </option>`;
      console.log(items[i].Title)
    }
    document.getElementById("grant").innerHTML = fetch;

  }







  //fetchfromIPRS
  private async fetchfromIPRS(itemByFilter: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      var items: any;
      if (this.IsFilterApplied == true) {
        items = itemByFilter;

      }
      else {
        items = await sp.web.lists.getByTitle("IPRS")
          .items.select("Society/Title,RightType/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,Author/Title,Author/Id,Author/EMail,Editor/Title,Editor/Id,Editor/EMail,*")
          .expand("Society,RightType,Source,Grant,Inclusion,Exclusion,Author,Editor").getAll();
        //orderBy("Created",false)
        console.log(items);
        this.APIDataForFilterSort = items;

      }


      let table = ``

      for (let i = 0; i < items.length; i++) {

        // let CreatedByMail = ''
        // sp.web.siteUsers.getById(items[i].AuthorId).get()
        //   .then(user => {
        //     //console.log('Email ID: ', user.Email);
        //     CreatedByMail = user.Email;

        //   });

        // let ModifiedByMail = ''
        // sp.web.siteUsers.getById(items[i].EditorId).get()
        //   .then(user => {
        //     //console.log('Email ID: ', user.Email);
        //     ModifiedByMail = user.Email;
        //   });

        table += `
   <tr>     
  <td>${items[i].Society.Title}</td>
  <td>${items[i].RightType.Title}</td>
  <td>${items[i].Source.Title}</td>
  <td>${items[i].Grant.Title}</td>
  <td>${moment(items[i].ValidFrom).format('YYYY-MMM-DD')}</td>
  <td>${moment(items[i].ValidTill).format('YYYY-MMM-DD')}</td>
  <td class="noExl"> 
  <div class="reciprocal-action-btn-box">
  <a type="button" href="#" class="btn custom-btn custom-btn-two" data-toggle="modal" data-target="#detail-modal${i}" id="detail${i}">Details</a>
  <a type="button" href="#" class="btn custom-btn custom-btn-two" data-toggle="modal" data-target="#history-modal${i}" id="history${i}">History</a>
  </div>
  </div>
  </td>
  </tr>
  `

        $(document).on('click', '#detail' + i, async (): Promise<any> => {
          var Dmodalid = i;
          var DId = items[i].ID;

          this.fetchforDetails(DId, Dmodalid);
        });

        $(document).on('click', '#history' + i, async (): Promise<any> => {
          var Hmodalid = i;

          this.fetchforhistory(Hmodalid);
        });


      }
      //document.getElementById('data').innerHTML = table;
      //$("#data").empty();
      ($("#tableId") as any).DataTable().destroy();
      $("#data").html(table);



      //if (this.IsFilterApplied == false) {

      ($("#tableId") as any).DataTable({
        items: 100,
        itemsOnPage: 10,
        cssStyle: 'light-theme',
        scrollY: '500px',
        scrollX: true,
        sScrollXInner: "100%",
        "aoColumns": [
          { "bSortable": true },
          { "bSortable": true },
          { "bSortable": true },
          { "bSortable": true },
          { "bSortable": true },
          { "bSortable": true },
          { "bSortable": false }
        ],
        "sDom": '<"top"f>rt<"bottom"pli>',
        "columnDefs": [
          {
            "targets": [0, -1], //first column / numbering column
            "orderable": false, //set not orderable
          },
        ],
        "lengthMenu": [[10, 50, 100, 250], [10, 50, 100, 250]],
        "order": [[3, "asc"]]
      });
      resolve();
    })


  }

  //}


  private async fetchforDetails(DetailitemID: any, DetailmodalID: any): Promise<void> {


    const items = await sp.web.lists.getByTitle("IPRS")
      .items.getById(DetailitemID).select("Society/Title,RightType/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,Author/Title,Author/Id,Author/EMail,Editor/Title,Editor/Id,Editor/EMail,*")
      .expand("Society,RightType,Source,Grant,Inclusion,Exclusion,Author,Editor").get();
    console.log(items.length);
    console.log(items);
    {

      this.modalHTMLDetails += `<div id="detail-modal${DetailmodalID}" class="modal fade" role="dialog">
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
                  <p>${items.Society.Title}</p> 
              </div>
          </div>
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Right Type:</label>
                  <p>${items.RightType.Title}</p>
              </div>
          </div>
      </div>
      <div class="row mt10">
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Source:</label>
                  <p>${items.Source.Title}</p>
              </div>
          </div>
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Grant:</label>
                  <p>${items.Grant.Title}</p>
              </div>
          </div>
      </div>
      <div class="row mt10">
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Inclusion:</label>
                  <p>${items.Inclusion.map((val: any) => {
        return (val.Title)
      })}</p>
              </div>
          </div>
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Exclusion:</label>
                  <p>${items.Exclusion.map((val: any) => {
        return (val.Title)
      })}</p>
              </div>
          </div>
      </div>
      <div class="row mt10">
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Valid From:</label>
                  <p>${moment(items.ValidFrom).format('YYYY-MMM-DD')}</p>
              </div>
          </div>
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Valid To:</label>
                  <p>${moment(items.ValidTill).format('YYYY-MMM-DD')}</p>
              </div>
          </div>
      </div>
      <div class="row mt10">
          <div class="col-sm-12 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Remarks:</label>
                  <p>${items.Remarks}</p>
              </div>
          </div>
      </div>
      <div class="row mt10">
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Created By:</label>
                  <div class="reciprocal-user-card-panel">
                  ${ /*<div class="reciprocal-user-card-img"> 
                          
                      </div>*/''}
                      <div class="reciprocal-user-card-info">
                          <div class="reciprocal-user-card-name ellipsis-1">
                          ${items.Author.Title}
                          </div>
                          <div class="reciprocal-user-card-email ellipsis-1">
                          ${items.Author.EMail}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Created On:</label>
                  <p>${moment(items.Created).format('YYYY-MMM-DD')}</p>
              </div>
          </div>
      </div>
      <div class="row mt10">
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Modified By:</label>
                  <div class="reciprocal-user-card-panel">
                  ${ /* Backtik comment
                    <div class="reciprocal-user-card-img">
                          
                      </div>*/''}
                      <div class="reciprocal-user-card-info">
                          <div class="reciprocal-user-card-name ellipsis-1">
                          ${items.Editor.Title}
                          </div>
                          <div class="reciprocal-user-card-email ellipsis-1">
                          ${items.Editor.EMail}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-sm-6 col-xs-12">
              <div class="form-group custom-form-group">
                  <label>Modified On:</label>
                  <p>${moment(items.Modified).format('YYYY-MMM-DD')}</p>
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
    $("#modal-list-collection-details").html(this.modalHTMLDetails)
  }



  private async fetchforhistory(HistorymodalID: any): Promise<void> {

    const items = await sp.web.lists.getByTitle("IPRS")
      .items.select("Society/Title,RightType/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,Author/Title,Author/Id,Author/EMail,Editor/Title,Editor/Id,Editor/EMail,*")
      .expand("Society,RightType,Source,Grant,Inclusion,Exclusion,Author,Editor").get();
    console.log(items.length);
    console.log(items);

    {
      this.modalHTMLHistory += `<div id="detail-modal${HistorymodalID}" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
  
          <!-- Modal content-->
          <div class="modal-content reciprocal-custom-modal">
              <div class="modal-header">
                  <button type="button" class="close close-round" data-dismiss="modal"><span
                          class="close-icon">×</span></button>
                  <h4 class="modal-title">History</h4>
              </div>
              <div class="modal-body">
                  <div class="row mt5">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                          <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                              <table class="table mb0 custom-table" id="historytableID">
                                  <thead>
                                      <tr>
                                          <th class="w-10-th">Society</th>
                                          <th class="w-10-th">Right</th>
                                          <th class="w-15-th">Source</th>
                                          <th class="w-10-th">Grant</th>
                                          <th class="w-5-th">Valid From</th>
                                          <th class="w-5-th">Valid Till</th>
                                      </tr>
                                  </thead>
                                  <tbody id="historytablebody">
                                      
                                  </tbody>
                              </table>
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
        `
    }
    $("#modal-list-collection-history").html(this.modalHTMLHistory) 

    let historytable = ``

for (let i = 0; i < items.length; i++) {
  
  historytable +=`
  <tr>
  <td>${items[i].Society.Title}</td>
  <td>${items[i].RightType.Title}</td>
  <td>${items[i].Source.Title}</td>
  <td>${items[i].Grant.Title}</td>
  <td>${moment(items[i].ValidFrom).format('YYYY-MMM-DD')}</td>
  <td>${moment(items[i].ValidTill).format('YYYY-MMM-DD')}</td>
  </tr>`
}
$("#historytablebody").html(historytable);
}



  private async exportfile(): Promise<void> {


    ($("#tableId") as any).table2excel({

      // exclude CSS class

      exclude: ".noExl",

      name: "Worksheet Name",

      filename: "IPRS",//do not include extension

      fileext: ".xls", // file extension

      exclude_img: true,

      exclude_links: true,
      exclude_inputs: true


    });


  }







  // private forselectedSociety() {   $("#society").change(function() {   
  //     var selectedSociety = $('#society option:selected', this).val();    
  //     console.log(selectedSociety)});
  // }



  public FilterAPIData() {
    let filterSociety: any[] = $("#society").val() as any;
    let filterRightType = $("#righttype").val();
    let filterSource = $("#source").val();
    let filterGrant = $("#grant").val();
    let filterValidFrom: any = $("#Fromdatefilter").val();
    filterValidFrom = moment(filterValidFrom).format("YYYY-MM-DD");
    filterValidFrom = new Date(filterValidFrom).getTime();

    let filterValidTill: any = $("#Todatefilter").val();
    filterValidTill = moment(filterValidTill).format("YYYY-MM-DD");
    filterValidTill = new Date(filterValidTill).getTime();

    this.APIDataFilter = this.APIDataForFilterSort;

    if (filterSociety.length == 0) {
      alert("Please fill the Society");
      $(".lds-dual-ring").hide();
    }

    // else if(filterRightType == null){
    //   alert("Please fill the RightType");
    //   $(".lds-dual-ring").hide();
    // }

    // else if(filterSource == null){
    //   alert("Please fill the Source");
    //   $(".lds-dual-ring").hide();
    // }

    // else if(filterGrant == null){
    //   alert("Please fill the Grant");
    //   $(".lds-dual-ring").hide();
    // }

    else if (Number.isNaN(filterValidFrom) || Number.isNaN(filterValidTill)) {
      alert("Please fill the dates");
      $(".lds-dual-ring").hide();

    }
    else {

      if (filterSociety.length > 0 && filterRightType != null && filterSource != null && filterGrant != null && filterValidFrom != "" && filterValidTill != "") {
        this.APIDataFilter = this.APIDataForFilterSort.filter(function (el) {
          let Societyfilterlist: string[] = []
          Societyfilterlist.push(el.SocietyId);
          let RightTypefilterlist = el.RightTypeId;
          let Sourcefilterlist = el.SourceId;
          let Grantfilterlist = el.GrantId;
          let ValidFromfilterlist = new Date(moment(el.ValidFrom).format("YYYY-MM-DD")).getTime();
          let ValidTillfilterlist = new Date(moment(el.ValidTill).format("YYYY-MM-DD")).getTime();

          //return Societyfilter.some(r=> filterSociety.indexOf(r) >= 0) && RightTypefilter == (filterRightType) && Sourcefilter == (filterSource) && Grantfilter == (filterGrant)
          return filterSociety.some(r => Societyfilterlist.toString().includes(r)) && RightTypefilterlist == filterRightType && Sourcefilterlist == filterSource && Grantfilterlist == filterGrant && filterValidFrom <= ValidFromfilterlist && ValidTillfilterlist <= filterValidTill
          //&&( (filterValidFrom >= ValidFromfilterlist) && (ValidTillfilterlist <= filterValidTill) )
        });
      }
      // if (filterSociety == "Having Attachments") {
      //     this.APIDataFilter = this.APIDataFilter.filter(function (el) {
      //     return el.hasAttachments === true;
      //   })
      // }
      // else if (filterSociety == "without Attachments") {
      //     this.APIDataFilter = this.APIDataFilter.filter(function (el) {
      //     return el.hasAttachments === false;
      //   })
      // } _.intersection(Societyfilter, filterSociety) 
      this.IsFilterApplied = true;
      this.fetchfromIPRS(this.APIDataFilter).then(() => {
        $(".lds-dual-ring").hide();
      })
    }



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