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
require("../../webparts/CommonAssets/assets/css/padding.css");
require("../../webparts/CommonAssets/assets/css/styles.css");
//require("../../webparts/iprsDashboard/assets/assets/font-awesome/css/font-awesome.min.css");
require("../../webparts/iprsDashboardV1/assets/assets/js/jquery.multiselect.js");
require("../../webparts/iprsDashboardV1/assets/assets/css/jquery.multiselect.css");
require("../../webparts/CommonAssets/ExcelJs/jquery.table2excel.js");
// require("../../webparts/CommonAssets/row-merge-bundle.min.js");

const ADDUploaded: any = require('../../webparts/CommonAssets/assets/images/edit-property-icon.png');
const filterUploaded: any = require('../../webparts/iprsDashboardV1/assets/assets/images/filter-icon.png');
const ExportUploaded: any = require('../../webparts/iprsDashboardV1/assets/assets/images/export-icon.png');
const HistoryIcon: any = require('../../webparts/iprsDashboardV1/assets/assets/images/HistoryIcon.png');
const IprsLogo: any = require("../../webparts/CommonAssets/assets/images/IPRS-logo.png");
const AdminManage: any = require("../../webparts/CommonAssets/assets/images/administrative-tools.png");
const Expandarrow: any = require("../../webparts/CommonAssets/assets/images/expand-arrow-icon.png");

import * as strings from 'IprsDashboardV1WebPartStrings';

export interface IIprsDashboardV1WebPartProps {
  description: string;
}
export interface ISociety {
  country: string;
  society: string;
}
export interface IRightType {
  country: string;
  society: string;
  rightType: string
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

  public CountrydropdownIPRS: any[] = [];
  public SocietydropdownIPRS: any[] = [];
  public RightTypedropdownIPRS: any[] = [];
  public CustomFieldGlobalName: any = "Others";
  public IsViewer: boolean = false;
  public IsInitiator: boolean = false;
  public IsContributor: boolean = false;
  public IsAdmin: boolean = false;
  public ShowAddButton: boolean = false;
  public ManageAdminPanel: boolean = false;


  public async render(): Promise<void> {
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    SPComponentLoader.loadCss("https://cdn.datatables.net/1.13.3/css/jquery.dataTables.min.css");
    SPComponentLoader.loadScript("https://cdn.datatables.net/1.13.3/js/jquery.dataTables.min.js");
    // SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
    // SPComponentLoader.loadScript("src/jquery.table2excel.js");


    let groups: [] = await sp.web.currentUser.groups();
    console.log(groups)
    groups.forEach((group: any) => {
      if (group.Title == "IPRS_Admin") {
        //this.IsContributor = true;
        this.IsAdmin = true;
        this.ShowAddButton = true;
        this.ManageAdminPanel =true;
      }
      else if (group.Title == "IPRS_Contributor") {
        this.IsContributor = true;
        this.ShowAddButton = true;
      }
      else if (group.Title == "IPRS_Initiator") {
        this.IsInitiator = true;
        this.ShowAddButton = true;
      }
      else if (group.Title == "IPRS_Reader") {
        this.IsViewer = true;
      }

    });


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

  
    <div class="lds-dual-ring-box"> <div class="lds-dual-ring"></div> </div>
<div class="container-fluid">
    <div class="custom-panel">
          <div class="panel-head panel-flex">
              <h1 class="panel-head-text">Reciprocal Dashboard</h1>
              <div class="reciprocal-legend-box">
                      <div class="d-flex align-center mr15 mb10">
                          <span class="reciprocal-green-dot"></span>
                          <span>Inclusion</span>
                      </div>
                <div class="d-flex align-center mr15 mb10">
                    <span class="reciprocal-red-dot"></span>
                    <span>Exclusion</span>
                </div>
                <div class="d-flex align-center mr15 mb10">
                    <span class="custom-edit-btn mr10">
                        <i class="fa fa-info"></i> 
                    </span>
                    <span>Details</span>
                </div>
                <div class="d-flex align-center mb10">
                    <div class="activity-history-legend mr5">
                        <img src="${HistoryIcon}" alt="" />
                    </div>
                    <span>History</span>
                </div>
              </div>
          </div>
        <div class="panel-body">
            <div class="row m-0 mb15 mt25">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                    <div class="scrollbar-panel chip-panel">
                        <div class="chip-box">
                            <div class="upload-chip" id="Country-Icon"></div>
                            ${/* <div class="upload-chip" id="City-Icon"></div>*/''}
                        </div>
                        <div class="chip-box">
                        <div class="upload-chip" id="Society-Icon"></div>
                        </div>
                        <div class="chip-box">
                        <div class="upload-chip" id="Right-Icon"></div>
                        </div>
                    </div> 
                </div> 
            </div>
            <div class="row m-0 mb5">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboard-new-panel-col-1">
                    <div class="dashboard-deta-btn-panel d-flex">
                        <div class="dropdown dashboard-table-btn">
                        ${(this.ShowAddButton) ? `<button class="btn dropdown-toggle" type="button" id="addnew">
                        <img class="dashboard-icon-info mr2" src="${ADDUploaded}" alt="plus">
                        <span>Manage</span>
                    </button>`: ""}
                            
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
                        <div class="dropdown dashboard-table-btn" id="admincontrol">

                                               ${this.ManageAdminPanel  ?`<button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                                    <img class="dashboard-icon-info mr2" src="${AdminManage}" alt="" data-themekey="#">
                                                    <span>Admin Controls</span>
                                                    <img class="dashboard-icon-info ml2" src="${Expandarrow}" alt="expand arrow" data-themekey="#">
                                                </button>` :""}

                                                <ul class="dropdown-menu dropdown-color-menu-icon">
                                                    <li>
                                                        <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/ManageCities.aspx">
                                                            <span class="">Manage Cities</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/ManageSocieties.aspx">
                                                            <span class="">Manage Societies</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/ManageSources.aspx">
                                                            <span class="">Manage Sources</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/ManageInclusions.aspx">
                                                            <span class="">Manage Inclusions</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/ManageExclusions.aspx">
                                                            <span class="">Manage Exclusions</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                            </div>
                        ${/*  Backtick Comment    
                        <div class="dropdown dashboard-table-btn">
                        
                            <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" id="sortId">
                              
                             
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
                        <table class="table mb0 custom-table" id="tableId" ">
                        <thead>
        <tr>
            <th class="w-10-th">Country</th> 
            <th class="w-10-th">Society</th>
            <th hidden class="noExl">City</th>
            <th class="w-10-th">Right</th>
            <th class="w-15-th">Source</th>
            <th class="w-7-th">Grant</th>
            <th class="w-3-th noExl">&nbsp;</th>
            <th class="w-5-th">Valid From</th>
            <th class="w-5-th">Valid Till</th>
            <th hidden>Inclusion</th>
            <th hidden>Exclusion</th>
            <th hidden>Remarks</th>
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
                    <select id="country" class="form-control" name="country_basic[]" multiple="multiple" >
                        
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
                    <span style="color:red;" class="MandSign">*</span>
                    <select id="righttype" name="right_basic[]" class="form-control">

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
                    <input type="date" class="form-control dateformat" name="" id="Fromdatefilter"> 
                </div>
            </div>
            <div class="col-sm-6 col-xs-12">
                <div class="form-group custom-form-group">
                    <label>To Date:</label>
                    <input type="date" class="form-control dateformat" name="" id="Todatefilter">
                </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn custom-btn mr-8" id="filterbutton" >Apply</button>
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


    this.bindevent();

  }

  private async bindevent() {

    this.fetchDropdownIPRS().then(() => {
      //this.fetchfromRightTypeMaster();
      this.fetchfromcountrymaster();
    })

    this.fetchfromSourceMaster();
    this.fetchfromGrantMaster();
    this.forselectedoptionCountry();
    //this.forselectedoptionSociety();



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


  private async fetchDropdownIPRS(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const IPRSItemOnFilterClick: any[] = await sp.web.lists.getByTitle("IPRS").items
        .select("Country/Id,RightType/Id,Society/Id")
        .expand("Country,RightType,Society")
        .getAll();
      console.log(IPRSItemOnFilterClick);
      IPRSItemOnFilterClick.forEach((item) => {
        if (!this.CountrydropdownIPRS.includes(item.Country.Id)) {
          this.CountrydropdownIPRS.push(item.Country.Id);
        }
        if (!this.SocietydropdownIPRS.includes(item.Society.Id)) {
          this.SocietydropdownIPRS.push(item.Society.Id);
        }
      })
      resolve("")


    })

  }

  //fetch from countrymaster

  private async fetchfromcountrymaster(): Promise<void> {
    //  const it = await sp.web.lists.getByTitle("IPRS").fields.getByTitle("Country").get();
    //  console.log(it);
    const items: any[] = await sp.web.lists.getByTitle("CountryMaster").items.get();
    console.log(items.length);

    let events = ``;
    //let events = ``;

    for (let i = 0; i < items.length; i++) {
      try {
        if (this.CountrydropdownIPRS.includes(items[i].ID)) {
          events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
          // console.log(items)

        }
      }
      catch { }
    }

    document.getElementById('country').innerHTML = events;
    $(function () {
      ($('#country') as any).multiselect({
        columns: 1,
        selectAllText: false,
        placeholder: 'Select Your Options',
        search: true,
        searchOptions: {
          'default': 'Search'
        },
        selectAll: true,
      });

    });

  }


  private forselectedoptionCountry() {
    var scope = this
    $("#country").on("change", function () {

      //var selectedCountry = $('option:selected', this).val();
      var selectedCountry = $("#country").val()

      //var selectedSociety = $("#societymaster").val();
      //var selectedRightType = $("#righttypemaster").val();

      console.log(selectedCountry)
      //scope.fetchfromIPRS(selectedCountry, selectedSociety, selectedRightType)
      scope.fetchfromSocietyMaster(selectedCountry);
    });

    $("#society").on("change", function () {

      //var selectedCountry = $('option:selected', this).val();
      var selectedCountry = $("#country").val();
      var selectedSociety = $("#society").val();

      console.log(selectedCountry)
      //scope.fetchfromIPRS(selectedCountry, selectedSociety, selectedRightType)
      scope.fetchfromRightTypeMaster(selectedCountry, selectedSociety);
    });

  }


  //fetchfromsocietymaster
  private async fetchfromSocietyMaster(CountryId: any): Promise<void> {
    let Filter = "";
    // if (CountryId != "") {
    //   Filter = `Country eq '${CountryId}'`

    // }
    for (let i = 0; i < CountryId.length; i++) {
      const id = CountryId[i];
      Filter += `Country eq '${id}'`;

      if (i != CountryId.length - 1) {
        Filter += ' or ';
      }

    }
    const items: any[] = await sp.web.lists
      .getByTitle("SocietyMaster")
      .items.filter(Filter).get();
    console.log(items);

    var fetch = ''
    //var fetch = ''
    for (var i = 0; i < items.length; i++) {
      if (this.SocietydropdownIPRS.includes(items[i].ID)) {
        fetch += `<option value= ${items[i].ID}> ${items[i].Title} - (${items[i].Code}) </option>`;
        //console.log(items[i].Title)
      }
    }
    $("#society").attr("multiple", true as any);

    document.getElementById("society").innerHTML = fetch;
    $(function () {
      ($('#society') as any).multiselect({
        columns: 1,
        selectAllText: false,
        placeholder: 'Select Your Options',
        search: true,
        searchOptions: {
          'default': 'Search'
        },
        selectAll: true,
      });

    });
    ($('#society') as any).multiselect('reload');


  }

  // private forselectedoptionSociety() {
  //   //var scope = this
  //   let Citytitle = ``
  //   $("#society").on("change", async function () {

  //     var selectedSociety = $('option:selected', this).val();
  //     var selectedCountry = $("#country").val();
  //     //var selectedRightType = $("#righttypemaster").val();

  //     console.log(selectedSociety)
  //     const items: any = await sp.web.lists
  //       .getByTitle("SocietyMaster")
  //       .items.filter(`Country eq '${selectedCountry}' and ID eq '${selectedSociety}'`).select("City/Title,*").expand("City").get();
  //     console.log(items);
  //     Citytitle = `${items[0].City.Title}`
  //     console.log(Citytitle);
  //     $("#City-Icon").text(Citytitle);

  //   });

  // }






  //fetchfromRightTypeMaster

  private async fetchfromRightTypeMaster(countryid: any, societyid: any): Promise<void> {
    // const items: any[] = await sp.web.lists
    //   .getByTitle("RightTypeMaster")
    //   .items.get();
    var countryFilter = '';
    var societyFilter = '';
    for (let i = 0; i < countryid.length; i++) {
      const id = countryid[i];
      countryFilter += `Country eq '${id}'`;

      if (i != countryid.length - 1) {
        countryFilter += ' or ';
      }

    }
    for (let i = 0; i < societyid.length; i++) {
      const id = societyid[i];
      /////add "and" for first time
      // if (i == 0) {
      //   societyFilter += ' and ';
      // }
      societyFilter += `Society eq '${id}'`;

      ////add "or" till last second time
      if (i != societyid.length - 1) {
        societyFilter += ' or ';
      }

    }
    const IPRSRightType: any[] = await sp.web.lists
      .getByTitle("IPRS")
      .items.filter(`(${countryFilter}) and (${societyFilter})`).select("RightType/Id,RightType/Title")
      .expand("RightType").get();
    console.log(IPRSRightType);
    this.RightTypedropdownIPRS = IPRSRightType.filter((obj, index) => {
      return index === IPRSRightType.findIndex(o => obj.RightType.Id === o.RightType.Id && obj.RightType.Title === o.RightType.Title);
    });

    var fetch = ``

    for (var i = 0; i < this.RightTypedropdownIPRS.length; i++) {
      fetch += `<option value= ${this.RightTypedropdownIPRS[i].RightType.Id}> ${this.RightTypedropdownIPRS[i].RightType.Title} </option>`;

      // console.log(items[i].Title)
    }

    $("#righttype").attr("multiple", true as any);
    document.getElementById("righttype").innerHTML = fetch;
    $(function () {
      ($('#righttype') as any).multiselect({
        columns: 1,
        selectAllText: false,
        placeholder: 'Select Your Options',
        search: true,
        searchOptions: {
          'default': 'Search'
        },
        selectAll: true,
      });

    });
    ($('#righttype') as any).multiselect('reload');

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
      //console.log(items[i].Title)
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
      //console.log(items[i].Title)
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
      // else {

      //   items = await sp.web.lists.getByTitle("IPRS")
      //     .items.select("Country/Title,Society/Title,RightType/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,Author/Title,Author/Id,Author/EMail,Editor/Title,Editor/Id,Editor/EMail,*")
      //     .expand("Country,Society,RightType,Source,Grant,Inclusion,Exclusion,Author,Editor").getAll();
      //   //orderBy("Created",false)
      //   console.log(items);
      //   this.APIDataForFilterSort = items; 

      // }


      let table = ``
      var uniqueid: number = Date.now();
      //var countryCount:number[]= [];
      var country: any[] = [];
      var societyArr: any[] = [];
      var rightTypeArr: any[] = [];

      for (let indx = 0; indx < items.length; indx++) {
        if (!country.includes(items[indx].Country.Title)) {
          country.push(items[indx].Country.Title);
        }
      }
      for (let i = 0; i < country.length; i++) {
        for (let indx = 0; indx < items.length; indx++) {
          if (country[i] == items[indx].Country.Title) {
            if (!societyArr.includes(items[indx].Society.Title)) {
              var obj: IRightType = {
                country: items[indx].Country.Title,
                society: items[indx].Society.Title,
                rightType: items[indx].RightType.Title

              };
              societyArr.push(obj);

            }

          }
        }
      }
      /*for (let i = 0; i < country.length; i++) {
        for (let indx = 0; indx < societyArr.length; indx++) {
          if (country[i] == societyArr[indx].country) {
            for (let j = 0; j < items.length; j++) {
             if(societyArr[indx].society==items[j].Society.Title)
             {   
              if (!rightTypeArr.includes(items[j].RightType.Title)) {
                var obj2: IRightType = {
                  country: items[j].Country.Title,
                  society: items[j].Society.Title,
                  rightType: items[j].RightType.Title
                };
                rightTypeArr.push(obj2);

              }
             }
            }
            

          }
        }
      }*/
      console.log(rightTypeArr);
      var country1: any[] = [];
      var society1: any[] = [];
      var rightType1: any[] = [];
      // var socityCnt=0;
      var rightCnt = 0;
      for (let i = 0; i < items.length; i++) {
        var countryCount = 0;
        var societyCount = 0;
        var rightCount = 0;
        if (!country1.includes(items[i].Country.Title)) {
          country1.push(items[i].Country.Title);
          for (let j = 0; j < societyArr.length; j++) {
            if (societyArr[j].country == items[i].Country.Title) {
              countryCount++;
            }


          }

        }
        if (countryCount > 0) {
          societyCount = 0;
          society1 = [];
          //  socityCnt=0;

        }
        if (!society1.includes(items[i].Society.Title)) {
          society1.push(items[i].Society.Title);
          for (let j = 0; j < societyArr.length; j++) {
            if (societyArr[j].society == items[i].Society.Title) {
              societyCount++;
            }
          }
          //  socityCnt=societyCount;
        }

        if (societyCount > 0 || rightCnt <= 0) {
          rightCount = 0;
          rightType1 = [];
          rightCnt = 0;
        }
        if (!rightType1.includes(items[i].RightType.Title)) {
          rightType1.push(items[i].RightType.Title);
          for (let j = 0; j < societyArr.length; j++) {
            if (societyArr[j].rightType == items[i].RightType.Title && societyArr[j].society == items[i].Society.Title) {
              rightCount++;
            }
          }
          rightCnt = rightCount;
        } else {
          rightCnt = rightCnt - 1;
        }
        let InclusionStatushtml = '';
        let ExclusionStatushtml = '';
        if (items[i].Inclusion.length > 0 && items[i].Exclusion.length > 0) {
          InclusionStatushtml += '<span class="reciprocal-green-dot"></span>';
          ExclusionStatushtml += '<span class="reciprocal-red-dot"></span>';

        }
        else if (items[i].Inclusion.length > 0) {
          InclusionStatushtml += '<span class="reciprocal-green-dot"></span>';
        }
        else if (items[i].Exclusion.length > 0) {
          ExclusionStatushtml += '<span class="reciprocal-red-dot"></span>';
        }
        let NewValidFrom: string = "'" + moment(items[i].ValidFrom).format("DD-MM-YYYY").toString();
        let NewValidTill: string = "'" + moment(items[i].ValidTill).format("DD-MM-YYYY").toString();

        //${(countryCount > 0) ? `<td rowspan="${countryCount}">${items[i].Country.Title}</td>` : ''} 
        table += `  
                  <tr> 
                  ${(countryCount > 0) ? `<td rowspan="${countryCount}" valign="middle" class="fb-600 border-right-d2-colr">${items[i].Country.Title}</td>` : ''} 
                  ${(societyCount > 0) ? `<td rowspan="${societyCount}" valign="middle" class="fb-600 border-right-d2-colr">${items[i].Society.Code}-${items[i].Society.Title}(${items[i].City.Title})</td>` : ''}
                  <td hidden class="noExl">${items[i].City.Title}</td> 
                  ${(rightCount > 0) ? `<td rowspan="${rightCount}" valign="middle" class="fb-600 border-right-d2-colr">${items[i].RightType.Title}</td>` : ''}
                    <td>${items[i].Source.Title}</td>
                    <td>${items[i].Grant.Title}</td>
                    <td class="noExl"><div class="reciprocal-status-dots-box">${InclusionStatushtml + ExclusionStatushtml}</div>
                     </td>
                    <td>${NewValidFrom}</td>
                    <td>${NewValidTill}</td>
                    <td hidden>${items[i].Inclusion.map((val: any) => {
          return ((val.Title == this.CustomFieldGlobalName) ? items[i].CustomInclusion : val.Title);
        })}</td>
                     <td hidden>${items[i].Exclusion.map((val: any) => {
          return ((val.Title == this.CustomFieldGlobalName) ? items[i].CustomExclusion : val.Title);
        })}</td>
                    ${(items[i].Remarks != null) ? `<td hidden>${items[i].Remarks}</td>` : ''}
                    
                    <td class="noExl"> 
                    <div class="reciprocal-action-btn-box">
                    <a type="button" href="#" class="custom-edit-btn mr15" data-toggle="modal" data-target="#detail-modal${i}" id="detail${i + uniqueid}">
                    <i class="fa fa-info"></i></a>
                    <a type="button" href="#" class="custom-edit-btn line-height-clock" data-toggle="modal" data-target="#history-modal${i}" id="history${i + uniqueid}">
                    <span class="activity-history-dashboard"><img src="${HistoryIcon}" alt=""/></span></a>
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
          var CountryHistoryid = items[i].CountryId;
          var SocietyHistoryid = items[i].SocietyId;
          var RightTypeHistoryid = items[i].RightTypeId;

          this.fetchforhistory(Hmodalid, CountryHistoryid, SocietyHistoryid, RightTypeHistoryid, SourceHistoryid);
        });

      }
      //document.getElementById('data').innerHTML = table;
      //$("#data").empty();

      // ($("#tableId") as any).DataTable().destroy();
      $("#data").html(table);



      //if (this.IsFilterApplied == false) {

      // ($("#tableId") as any).DataTable(
      //   {

      //     "searching": false,
      //     // scrollY: '200px',
      //     // scrollCollapse: true,

      //     // "aoColumns": [
      //     //   { "bSortable": true },
      //     //   { "bSortable": false }, 
      //     //   { "bSortable": false },
      //     //   { "bSortable": false }, 
      //     //   { "bSortable": false }, 
      //     //   { "bSortable": false },
      //     //   { "bSortable": false },
      //     //   { "bSortable": false }
      //     // ],

      //     //"sDom": '<"top"f>rt<"bottom"pli>',
      //     "initComplete": function () {
      //       $("#tableId").wrap("<div style='overflow:auto; width:100%; position:relative;'></div>");
      //     },
      //   }
      // );
      resolve();
    })


  }

  //}


  private async fetchforDetails(DetailitemID: any, DetailmodalID: any): Promise<void> {


    const items = await sp.web.lists.getByTitle("IPRS")
      .items.getById(DetailitemID).select("Country/Title,Society/Title,Society/Code,RightType/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,Author/Title,Author/Id,Author/EMail,Editor/Title,Editor/Id,Editor/EMail,*")
      .expand("Country,Society,RightType,Source,Grant,Inclusion,Exclusion,Author,Editor").get();
    var SocietyIdIPRS = items.SocietyId;
    console.log(items.length);
    console.log(items);
    const Societyitems = await sp.web.lists.getByTitle("SocietyMaster")
      .items.getById(SocietyIdIPRS).select("City/Title,*")
      .expand("City").get();
    console.log(Societyitems.length);
    console.log(Societyitems);
    // let InclusionIndex = items.Inclusion.indexOf("CustomField");
    // var NewInclusionName = items.Inclusion;
    // if( InclusionIndex != -1){
    //   items.Inclusion[InclusionIndex] = items.CustomInclusion;
    //    NewInclusionName =  items.Inclusion;
    // }

    // let ExclusionIndex = items.Exclusion.indexOf("CustomField");
    // var NewExclusionName = items.Exclusion;
    // if( ExclusionIndex != -1){
    //   items.Exclusion[ExclusionIndex] = items.CustomExclusion;
    //    NewExclusionName =  items.Exclusion;
    // }

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
                          <label>Country:</label>
                          <p>${items.Country.Title}</p> 
                      </div>
                  </div>
                  <div class="col-sm-6 col-xs-12">
                      <div class="form-group custom-form-group">
                          <label>City:</label>
                          <p>${Societyitems.City.Title}</p>
                      </div>
                  </div>
              </div>
            <div class="row mt10">
                <div class="col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Society:</label>
                        <p>${items.Society.Title} - (${items.Society.Code})</p> 
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
        return ((val.Title == this.CustomFieldGlobalName) ? items.CustomInclusion : val.Title);
      })}</p>
                    </div>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Exclusion:</label>
                        <p>${items.Exclusion.map((val: any) => {
        return ((val.Title == this.CustomFieldGlobalName) ? items.CustomExclusion : val.Title);
      })}</p>
                    </div>
                </div>
            </div>
            <div class="row mt10">
                <div class="col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Valid From:</label>
                        <p>${moment(items.ValidFrom).format('DD-MM-YYYY')}</p>
                    </div>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Valid Till:</label>
                        <p>${moment(items.ValidTill).format('DD-MM-YYYY')}</p>
                    </div>
                </div>
            </div>
            <div class="row mt10">
                <div class="col-sm-12 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Remarks:</label>
                        ${(items.Remarks != null) ? `<p>${items.Remarks}</p>` : ''} 
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
                        <p>${moment(items.Created).format('DD-MM-YYYY')}</p>
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
                        <p>${moment(items.Modified).format('DD-MM-YYYY')}</p>
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



  private async fetchforhistory(HistorymodalID: any, CountryHistoryID: any, SocietyHistoryID: any, RightTypeHistoryid: any, SourceHistoryID: any): Promise<void> {

    const items = await sp.web.lists.getByTitle("IPRS")
      .items.filter(`Country eq '${CountryHistoryID}' and Society eq '${SocietyHistoryID}' and RightType eq '${RightTypeHistoryid}' and Source eq '${SourceHistoryID}'`).select("Country/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,*")
      .expand("Country,Source,Grant,Inclusion,Exclusion").orderBy("Created", false).get();
    console.log(items.length);
    console.log(items);

    let historytable = ``;

    for (let i = 0; i < items.length; i++) {

      historytable += ` 
      <tr>
      <td>${items[i].Grant.Title}</td>
      <td>${items[i].Inclusion.map((val: any) => {
        return ((val.Title == this.CustomFieldGlobalName) ? items[i].CustomInclusion : val.Title)
      })}</td>
      <td>${items[i].Exclusion.map((val: any) => {
        return ((val.Title == this.CustomFieldGlobalName) ? items[i].CustomExclusion : val.Title)
      })}</td>
      <td>${moment(items[i].ValidFrom).format('DD-MM-YYYY')}</td>
      <td>${moment(items[i].ValidTill).format('DD-MM-YYYY')}</td>
      ${/* <td>${moment(items[i].Created).format('DD-MM-YYYY')}</td>*/''}
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
                  <h4 class="modal-title">${items[0].Source.Title}</h4>
              </div> 
              <div class="modal-body">
                  <div class="row mt5">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                          <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                              <table class="table mb0 custom-table" id="historytableID${HistorymodalID}"> 
                                  <thead>
                                      <tr>
                                          <th class="w-10-th">Grant</th>
                                          <th class="w-10-th">Inclusion</th>
                                          <th class="w-10-th">Exclusion</th>
                                          <th class="w-5-th">Valid From</th>
                                          <th class="w-5-th">Valid Till</th>
                                          ${/* <th class="w-5-th">Created On</th>*/''}
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
    // ($(`#historytableID${HistorymodalID}`) as any).DataTable().destroy();
    // ($(`#historytableID${HistorymodalID}`) as any).DataTable(
    //   {
    //     // items: 100,
    //     // itemsOnPage: 10,
    //     // cssStyle: 'light-theme',
    //     // scrollY: '500px',
    //     // scrollX: true,
    //     // sScrollXInner: "100%",
    //     "searching": false,
    //     //"ordering": false,
    //     "aoColumns": [
    //       { "bSortable": true },
    //       { "bSortable": false },
    //       { "bSortable": false },
    //       { "bSortable": false },
    //       { "bSortable": false },
    //       { "bSortable": false },
    //     ],
    //     "sDom": '<"top"f>rt<"bottom"pli>',
    //     // "columnDefs": [ 
    //     //   { "orderable": false, "targets": [-1,0,1,2,3,4] }, 
    //     //  ],

    //     // ],
    //     // "lengthMenu": [[10, 50, 100, 250], [10, 50, 100, 250]],
    //     // "order": [[3, "asc"]]
    //   }
    // );


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
    $("#Country-Icon").text($("#country option:selected").text().replaceAll("  ", ","));
    $("#Society-Icon").text($("#society option:selected").text().replaceAll("  ", ","));
    $("#Right-Icon").text($("#righttype option:selected").text().replaceAll("  ", ","));
    if (filterCountry.length == 0) {
      alert("Please select the Country");
      $(".lds-dual-ring").hide();
      return;
    }
    else if (filterSociety.length == 0) {
      alert("Please select the Society");
      $(".lds-dual-ring").hide();
      return;
    }
    else if (filterRightType.length == 0) {
      alert("Please select the RightType");
      $(".lds-dual-ring").hide();
      return;
    }
    let filter = '';
    let countryFilter = '';
    let societyFilter = '';
    let rightTypeFilter = '';
    // else {

    // if (filterCountry != "") {
    for (let i = 0; i < filterCountry.length; i++) {
      const id = filterCountry[i];
      countryFilter += `Country eq '${id}'`;

      if (i != filterCountry.length - 1) {
        countryFilter += ' or ';
      }

    }
    for (let i = 0; i < filterSociety.length; i++) {
      const id = filterSociety[i];
      /////add "and" for first time
      // if (i == 0) {
      //   societyFilter += ' and ';
      // }
      societyFilter += `Society eq '${id}'`;

      ////add "or" till last second time
      if (i != filterSociety.length - 1) {
        societyFilter += ' or ';
      }

    }
    for (let i = 0; i < filterRightType.length; i++) {
      const id = filterRightType[i];
      // if (i == 0) {
      //   rightTypeFilter += ' and ';
      // }
      rightTypeFilter += `RightType eq '${id}'`;

      if (i != filterRightType.length - 1) {
        rightTypeFilter += ' or ';
      }

    }

    //}
    // if (filterRightType != '') {
    //   filter += ` and RightType eq '${filterRightType}'`;
    // }
    // if (filterSociety != '') {
    //   filter += ` and Society eq '${filterSociety}'`;
    // }
    if (filterGrant != "") {
      filter += ` and (Grant eq '${filterGrant}')`;
    }
    if (filterSource != "") {
      filter += ` and (Source eq '${filterSource}')`;
    }
    if (filterValidFrom != "") {
      filter += ` and (ValidFrom ge '${filterValidFrom}')`;
    }
    if (filterValidTill != "") {
      filter += `and (ValidTill le '${filterValidTill}')`;
    }
    console.log(filter)

    // }
    const IPRSItemOnFilterClick: any[] = await sp.web.lists.getByTitle("IPRS").items
      .select("*,Country/Title,RightType/Title,Society/Title,Society/Code,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title,City/Title")
      .expand("Country,RightType,Society,Source,Grant,Inclusion,Exclusion,City")
      .filter(`(${countryFilter}) and (${societyFilter}) and (${rightTypeFilter})${filter}`)
      .orderBy("Created", false)
      .getAll();
    console.log(IPRSItemOnFilterClick);
    //let distinctArr: any[] = [];
    //let isInArr: boolean = false;
    // IPRSItemOnFilterClick.forEach((val, ind) => {
    //   isInArr = false;
    //   try {
    //     for (let i = 0; i < distinctArr.length; i++) {
    //       if (val.SourceId == distinctArr[i].SourceId) {
    //         isInArr = true;
    //       }
    //     }
    //   } catch { }
    //   if (isInArr == false) {
    //     distinctArr.push(val);
    //   }
    // })
    //console.log("distinctArr" + distinctArr)
    var groups = _.groupBy(IPRSItemOnFilterClick, function (value) {
      return value.Country.Title + value.Society.Title + value.RightType.Title + value.Source.Title;
    });
    console.log(groups);
    let latestSourceArray: any[] = [];


    Object.values(groups).forEach(val => {
      //console.log(val);
      if (val.length > 1) {
        var element = val[val.length - 1];
        latestSourceArray.push(element);
        //break;
      }
      else {
        var element = val[0];
        latestSourceArray.push(element);
        //break;
      }

    });
    latestSourceArray = _.sortBy(latestSourceArray, [(Country) => Country.CountryId, (Country) => Country.SocietyId, (Country) => Country.RightTypeId])
    console.log(latestSourceArray);
    // for (var key in groups) {
    //   var obj = key;//groups[key];
    //   //for (let i = 0; i < obj.length; i++) {
    //     if (obj.length > 1) {
    //       var element = obj[obj.length - 1];
    //       latestSourceArray.push(element);
    //       //break;
    //     }
    //     else {
    //       var element = obj[0];
    //       latestSourceArray.push(element);
    //       //break;
    //     }


    //}

    // ...
    // }
    // latestSourceArray = Object.values(groups)
    // console.log(latestSourceArray);

    this.IsFilterApplied = true;
    this.fetchfromIPRS(latestSourceArray).then(() => {
      $(".lds-dual-ring").hide();
      ($("#dashboard-filter") as any).modal("hide");

    })

  }


  // public FilterAPIData() {
  //   let filterSociety = $("#society").val() as any;
  //   let filterRightType: any = $("#righttype").val();
  //   let Country: any = $("#country").val();
  //   let filterSource = $("#source").val();
  //   let filterGrant = $("#grant").val();
  //   let filterValidFrom: any = $("#Fromdatefilter").val();
  //   filterValidFrom = moment(filterValidFrom).format("YYYY-MM-DD");
  //   filterValidFrom = new Date(filterValidFrom).getTime();

  //   let filterValidTill: any = $("#Todatefilter").val();
  //   filterValidTill = moment(filterValidTill).format("YYYY-MM-DD");
  //   filterValidTill = new Date(filterValidTill).getTime();
  //   $("#Country-Icon").text($("#country option:selected").text());
  //   $("#Society-Icon").text($("#society option:selected").text());
  //   $("#Right-Icon").text($("#righttype option:selected").text());

  //   this.APIDataFilter = this.APIDataForFilterSort;


  //   if (filterSociety != '' && Country != '') {
  //     this.APIDataFilter = this.APIDataForFilterSort.filter(function (el) {
  //       let Societyfilterlist: string[] = []
  //       Societyfilterlist.push(el.SocietyId);
  //       let Countryfilterlist = el.CountryId;
  //       return Societyfilterlist.some(r => filterSociety.toString().includes(r)) && Country == Countryfilterlist
  //     });
  //   }
  //   if (filterSource != '') {
  //     this.APIDataFilter = this.APIDataFilter.filter(function (el) {
  //       let Sourcefilterlist = el.SourceId;
  //       return Sourcefilterlist == filterSource
  //     });
  //   }
  //   if (filterGrant != '') {
  //     this.APIDataFilter = this.APIDataFilter.filter(function (el) {
  //       let Grantfilterlist = el.GrantId;
  //       return Grantfilterlist == filterGrant
  //     });
  //   }
  //   if (!Number.isNaN(filterValidTill)) {
  //     this.APIDataFilter = this.APIDataFilter.filter(function (el) {
  //       let ValidTillfilterlist = new Date(moment(el.ValidTill).format("YYYY-MM-DD")).getTime();
  //       return ValidTillfilterlist <= filterValidTill
  //     }); 
  //   }
  //   if (!Number.isNaN(filterValidFrom)) {
  //     this.APIDataFilter = this.APIDataFilter.filter(function (el) {
  //       let ValidFromfilterlist = new Date(moment(el.ValidFrom).format("YYYY-MM-DD")).getTime();
  //       return filterValidFrom <= ValidFromfilterlist
  //     });
  //   }
  //   if (filterRightType != '') {
  //     this.APIDataFilter = this.APIDataFilter.filter(function (el) {
  //       let RightTypefilterlist = el.RightTypeId;
  //       return RightTypefilterlist == filterRightType
  //     });
  //   }




  //   this.IsFilterApplied = true;
  //   this.fetchfromIPRS(this.APIDataFilter).then(() => {
  //     $(".lds-dual-ring").hide();
  //   })




  // }

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
