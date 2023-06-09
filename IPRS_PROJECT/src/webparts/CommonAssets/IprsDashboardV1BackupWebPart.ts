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
  public CountryIdApplyFilter = '';
  public SocietyIdApplyFilter = '';


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
                            <div class="upload-chip" id="Country-Icon"></div>
                            <div class="upload-chip" id="Society-Icon"></div>
                            <div class="upload-chip" id="Right-Icon"></div>
                            <div class="upload-chip" id="City-Icon"></div>
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
        <div class="col-sm-4 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Country:</label>
                    <span style="color:red;" class="MandSign">*</span>
                    <select id="country" class="form-control">
                        
                    </select>
                </div>
          </div>
            <div class="col-sm-4 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>Society:</label>
                    <span style="color:red;" class="MandSign">*</span>
                    <select id="society" name="society_basic[]" class="form-control">
                        
                    </select>
                </div>
            </div>
            <div class="col-sm-4 col-xs-12">
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
                    <input type="date" class="form-control" name="" id="Fromdatefilter">
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>To Date:</label>
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

    //this.fetchfromSocietyMaster();
    //this.societymultiselect();
    this.fetchfromRightTypeMaster();
    this.fetchfromSourceMaster();
    this.fetchfromGrantMaster();
    this.fetchfromcountrymaster();
    this.forselectedoptionCountry();
    this.forselectedoptionSociety();
    
    

    ($("#dashboard-filter") as any).modal().show();
    // this.fetchfromIPRS("").then(() => {
    //   $(".lds-dual-ring").hide();
    // })
    //this.SortAPIData();
    this.domElement.querySelector('#exportid').addEventListener('click', () => {
      this.exportfile();
    });

    this.domElement.querySelector('#filterbutton').addEventListener('click', () => {
      $(".lds-dual-ring").show();
      //this.FilterAPIData();
      this.FilterAPIDataOnclick();
      $("#modal-list-collection-details").empty();
      $("#modal-list-collection-history").empty();

      


    });
    //this.searchfunction();


    // this.domElement.querySelector('#addnew').addEventListener('click', () => {
    //   window.location.href = `${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSAddForm.aspx?mode=New`

    // });

    this.domElement.querySelector('#addnew').addEventListener('click', () => {
      window.location.href = `${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSAddForm.aspx?mode=New`
    });

  }

  //fetch from countrymaster

  private async fetchfromcountrymaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("CountryMaster").items.get();
    console.log(items.length);

    let events = `<option value=""disabled selected>--select--</option>`;
    //let events = ``;

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
      console.log(items)

    }

    document.getElementById('country').innerHTML = events;

  }


  private forselectedoptionCountry() {
    var scope = this
    $("#country").on("change", function () {

      var selectedCountry = $('option:selected', this).val();
      //var selectedSociety = $("#societymaster").val();
      //var selectedRightType = $("#righttypemaster").val();

      console.log(selectedCountry)
      //scope.fetchfromIPRS(selectedCountry, selectedSociety, selectedRightType)
      scope.fetchfromSocietyMaster(selectedCountry);
    });

  }


  //fetchfromsocietymaster
  private async fetchfromSocietyMaster(CountryId: any): Promise<void> {
    const items: any[] = await sp.web.lists
      .getByTitle("SocietyMaster")
      .items.filter(`Country eq '${CountryId}'`).get();
    console.log(items);

    var fetch = '<option value=""disabled selected>--select--</option>'
    //var fetch = ''
    for (var i = 0; i < items.length; i++) {
      fetch += `<option value= ${items[i].ID}> ${items[i].Title} </option>`;
      console.log(items[i].Title)
    }

    document.getElementById("society").innerHTML = fetch;
    

  }

  private  forselectedoptionSociety() {
    //var scope = this
    let Citytitle =``
   $("#society").on("change", async function () {

      var selectedSociety = $('option:selected', this).val();
      var selectedCountry = $("#country").val();
      //var selectedRightType = $("#righttypemaster").val();

      console.log(selectedSociety)
      const items: any = await sp.web.lists
      .getByTitle("SocietyMaster")
      .items.filter(`Country eq '${selectedCountry}' and ID eq '${selectedSociety}'`).select("City/Title,*").expand("City").get();
    console.log(items); 
    Citytitle = `${items[0].City.Title}`
    console.log(Citytitle);
    $("#City-Icon").text(Citytitle);

    });

  }


 



  //fetchfromRightTypeMaster

  private async fetchfromRightTypeMaster(): Promise<void> {
    const items: any[] = await sp.web.lists
      .getByTitle("RightTypeMaster")
      .items.get();
    console.log(items);

    var fetch = `<option value="" selected>All-RightType</option>`

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

    var fetch = `<option value="" selected> All </option>`
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

    var fetch = `<option value="" selected> All </option>`
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
      var uniqueid: number = Date.now();

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
  <a type="button" href="#" class="btn custom-btn custom-btn-two" data-toggle="modal" data-target="#detail-modal${i}" id="detail${i + uniqueid}">Details</a>
  <a type="button" href="#" class="btn custom-btn custom-btn-two" data-toggle="modal" data-target="#history-modal${i}" id="history${i + uniqueid}">History</a>
  </div>
  </td>
  </tr>
  `

        $(document).one('click', `#detail${i + uniqueid}`, async (): Promise<any> => {
          var Dmodalid = i;
          var DId = items[i].ID;

          this.fetchforDetails(DId, Dmodalid);
        });

        $(document).one('click', `#history${i + uniqueid}`, async (): Promise<any> => {
          var Hmodalid = i;
          var SourceHistoryid = items[i].SourceId;

          this.fetchforhistory(this.CountryIdApplyFilter, this.SocietyIdApplyFilter, SourceHistoryid, Hmodalid);
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
      this.modalHTMLDetails = "";

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
                  <p>${items.Inclusion.map((val: any) => {
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
    $("#modal-list-collection-details").append(this.modalHTMLDetails);
    ($(`#detail-modal${DetailmodalID}`) as any).modal().show()
  }



  private async fetchforhistory(CountryHistoryID: any, SocietyHistoryID: any, SourceHistoryID: any, HistorymodalID: any): Promise<void> {

    const items = await sp.web.lists.getByTitle("IPRS")
      .items.filter(`Country eq '${CountryHistoryID}' and Society eq '${SocietyHistoryID}' and Source eq '${SourceHistoryID}'`).select("Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,*")
      .expand("Source,Grant,Inclusion,Exclusion").orderBy("Created", false).get();
    console.log(items.length);
    console.log(items);

    let historytable = ``;

    for (let i = 0; i < items.length; i++) {

      historytable += `
      <tr>
      <td>${items[i].Source.Title}</td>
      <td>${items[i].Grant.Title}</td>
      <td>${items[i].Inclusion.map((val: any) => { return (val.Title) })}</td>
      <td>${items[i].Exclusion.map((val: any) => { return (val.Title) })}</td>
      <td>${moment(items[i].ValidFrom).format('YYYY-MMM-DD')}</td>
      <td>${moment(items[i].ValidTill).format('YYYY-MMM-DD')}</td>
      </tr>`
    }

    {
      this.modalHTMLHistory = "";
      this.modalHTMLHistory += `<div id="history-modal${HistorymodalID}" class="modal fade" role="dialog">
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
                                          <th class="w-10-th">Source</th>
                                          <th class="w-10-th">Grant</th>
                                          <th class="w-15-th">Inclusion</th>
                                          <th class="w-10-th">Exclusion</th>
                                          <th class="w-5-th">Valid From</th>
                                          <th class="w-5-th">Valid Till</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    ${historytable}  
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
    $("#modal-list-collection-history").append(this.modalHTMLHistory);


    //$("#historytablebody").html(historytable);
    ($(`#history-modal${HistorymodalID}`) as any).modal().show();
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


  /**
   * FilterAPIDataOnclick
   
  */
  public async FilterAPIDataOnclick() {
    let filterSociety = $("#society").val() as any;
    this.SocietyIdApplyFilter = filterSociety;
    let filterRightType: any = $("#righttype").val();
    let filterCountry: any = $("#country").val();
    this.CountryIdApplyFilter = filterCountry;
    let filterSource = $("#source").val();
    let filterGrant = $("#grant").val();
    let filterValidFrom: any = $("#Fromdatefilter").val();

    let filterValidTill: any = $("#Todatefilter").val();

    $("#Country-Icon").text($("#country option:selected").text());
    $("#Society-Icon").text($("#society option:selected").text());
    $("#Right-Icon").text($("#righttype option:selected").text());
    let filter = '';
    if (filterCountry == null) {
      alert("Please select the Country")
      return;
    }
    else if(filterSociety == null){
      alert("Please select the Country")
      return;
    }
    else {
      if (filterCountry != "") {
        filter += `Country eq '${filterCountry}'`;
      }
      if (filterRightType != '') {
        filter += ` and RightType eq '${filterRightType}'`;
      }
      if (filterSociety != '') {
        filter += ` and Society eq '${filterSociety}'`;
      }
      if (filterGrant != "") {
        filter += ` and Grant eq '${filterGrant}'`;
      }
      if (filterSource != "") {
        filter += ` and Source eq '${filterSource}'`;
      }
      if (filterValidFrom != "") {
        filter += ` and ValidFrom ge '${filterValidFrom}'`;
      }
      if (filterValidTill != "") {
        filter += `and ValidTill le '${filterValidTill}'`;
      }
    }

    const IPRSItemOnFilterClick: any[] = await sp.web.lists.getByTitle("IPRS").items
      .select("*, RightType/Title,Society/Title,Source/Title,Grant/Title")
      .expand("RightType,Society,Source,Grant")
      .filter(`${filter}`).orderBy("Created", false)
      .get();
    console.log(IPRSItemOnFilterClick);
    let distinctArr: any[] = [];
    let isInArr: boolean = false;
    IPRSItemOnFilterClick.forEach((val, ind) => {
      isInArr = false;
      try {
        for (let i = 0; i < distinctArr.length; i++) {
          if (val.SourceId == distinctArr[i].SourceId) {
            isInArr = true;
          }
        }
      } catch { }
      if (isInArr == false) {
        distinctArr.push(val);
      }
    })
    console.log("distinctArr" + distinctArr)
    this.IsFilterApplied = true;
    this.fetchfromIPRS(distinctArr).then(() => {
      $(".lds-dual-ring").hide();
      
    })

  }


  public FilterAPIData() {
    let filterSociety = $("#society").val() as any;
    let filterRightType: any = $("#righttype").val();
    let Country: any = $("#country").val();
    let filterSource = $("#source").val();
    let filterGrant = $("#grant").val();
    let filterValidFrom: any = $("#Fromdatefilter").val();
    filterValidFrom = moment(filterValidFrom).format("YYYY-MM-DD");
    filterValidFrom = new Date(filterValidFrom).getTime();

    let filterValidTill: any = $("#Todatefilter").val();
    filterValidTill = moment(filterValidTill).format("YYYY-MM-DD");
    filterValidTill = new Date(filterValidTill).getTime();
    $("#Country-Icon").text($("#country option:selected").text());
    $("#Society-Icon").text($("#society option:selected").text());
    $("#Right-Icon").text($("#righttype option:selected").text());

    this.APIDataFilter = this.APIDataForFilterSort;

    if (filterSociety != '' && Country != '') {
      this.APIDataFilter = this.APIDataForFilterSort.filter(function (el) {
        let Societyfilterlist: string[] = []
        Societyfilterlist.push(el.SocietyId);
        let Countryfilterlist = el.CountryId;
        return Societyfilterlist.some(r => filterSociety.toString().includes(r)) && Country == Countryfilterlist
      });
    }
    if (filterSource != '') {
      this.APIDataFilter = this.APIDataFilter.filter(function (el) {
        let Sourcefilterlist = el.SourceId;
        return Sourcefilterlist == filterSource
      });
    }
    if (filterGrant != '') {
      this.APIDataFilter = this.APIDataFilter.filter(function (el) {
        let Grantfilterlist = el.GrantId;
        return Grantfilterlist == filterGrant
      });
    }
    if (!Number.isNaN(filterValidTill)) {
      this.APIDataFilter = this.APIDataFilter.filter(function (el) {
        let ValidTillfilterlist = new Date(moment(el.ValidTill).format("YYYY-MM-DD")).getTime();
        return ValidTillfilterlist <= filterValidTill
      });
    }
    if (!Number.isNaN(filterValidFrom)) {
      this.APIDataFilter = this.APIDataFilter.filter(function (el) {
        let ValidFromfilterlist = new Date(moment(el.ValidFrom).format("YYYY-MM-DD")).getTime();
        return filterValidFrom <= ValidFromfilterlist
      });
    }
    if (filterRightType != '') {
      this.APIDataFilter = this.APIDataFilter.filter(function (el) {
        let RightTypefilterlist = el.RightTypeId;
        return RightTypefilterlist == filterRightType
      });
    }




    this.IsFilterApplied = true;
    this.fetchfromIPRS(this.APIDataFilter).then(() => {
      $(".lds-dual-ring").hide();
    })




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
