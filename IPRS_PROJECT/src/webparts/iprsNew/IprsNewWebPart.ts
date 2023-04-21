import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
//import { IReadonlyTheme } from '@microsoft/sp-component-base';
//import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
//import styles from './IprsNewWebPart.module.scss';
import * as strings from 'IprsNewWebPartStrings';
import 'jquery';
require('bootstrap');
require("../iprsNew/assets/assets1/css/padding.css");
require("../iprsNew/assets/assets1/css/styles.css");
//require("../iprsNew/assets/assets1/font-awesome/css/font-awesome.min.css");
require("../../webparts/CommonAssets/Common.js");
require("../../webparts/CommonAssets/Style.css");
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as _ from "lodash";
import * as moment from 'moment';


//import * as $ from 'jquery';
export interface IIprsNewWebPartProps {
  description: string;
}

//declare var GrantMaster: any[];
//declare var InclusionMaster: any[]; 
//declare var ExclusionMaster: any[];

export default class IprsNewWebPart extends BaseClientSideWebPart<IIprsNewWebPartProps> {

  //private _isDarkTheme: boolean = false;
  //private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    sp.setup(this.context as any)
    return super.onInit();
  }

  //public fetchfromsocietymaster(): any[];
  public CustomFieldGlobalName: any = "Others";
  public GrantMaster: any[];
  public InclusionMaster: any[];
  public ExclusionMaster: any[];
  public TestGit: string[];
  public TestGITBYMAYUR: any[];
  public TestGit3: any[];
  public SelectedCity: any;
  public table =
    `<thead>
    <tr>
    <th class="w-10-th">Source <span class="text-red">*</span></th>
    <th class="w-10-th">Grant <span class="text-red">*</span></th>
    <th>Inclusion</th>
    <th>Exclusion</th>
    <th class="w-1-th">Valid From <span class="text-red">*</span></th>
    <th class="w-1-th">Valid Till <span class="text-red">*</span></th>
    <th>Remarks</th>
    <th class="w-5-th">Action</th>
</tr>
</thead>`
  public ExclusionMasterHTML = ``;
  public modalHTMLExclusion = ``;
  public InclusionMasterHTML = ``;
  public modalHTMLInclusion = ``;
  public Sourceitems: any[] = [];
  public IsViewer: boolean = false;
  public IsInitiator: boolean = false;
  public IsContributor: boolean = false;
  public ShowEditButton: boolean = false;
  public ShowAddButton: boolean = false;


  public async render(): Promise<void> {



    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css');

    this.domElement.innerHTML = `
    <div id ="mainDIV" class="container-fluid">
    <div class="custom-panel">
        <div class="panel-head">
            <h1 class="panel-head-text">Reciprocal Add Screen</h1>
        </div>
        <div class="panel-body">
            <div class="row mt25">
            <div class="col-md-3 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Country: <span class="text-red">*</span></label>
                        <select class="form-control" id="countrymaster">
                        </select>
                    </div>
            </div>
                <div class="col-md-3 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Society: <span class="text-red">*</span></label>
                        <select class="form-control" id="societymaster">
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Right Type:<span class="text-red">*</span></label>
                        <select class="form-control" id="righttypemaster">

                        </select>
                    </div>
                </div>
            </div>
            <div class="row mt15">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                        <table class="table mb0 custom-table">
                            <tbody id="data"> </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="mt20 text-center">
                <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90" id="btnsubmit">Submit</button>
                <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSDashboard.aspx" type="button" class="btn custom-btn-two-cancel mr5 wpx-90">Close</a>
                <button type="button" data-dismiss="modal" class="btn btn-info mr5 wpx-90" id="cancel-btn">Cancel</button>
            </div>

        </div>
    </div>
</div>
<div id ="modal-list-collection-inclusion">
</div>

  <div id ="modal-list-collection-exclusion">
  </div>
        `
    this._bindEvents();


  }

  private async _bindEvents() {
    let groups = await sp.web.currentUser.groups();
    console.log(groups)
    groups.forEach((group: any) => {
      if (group.Title == "IPRS_Reader") {
        this.IsViewer = true;
        alert("Sorry, you are not allowed to access this page")
        window.location.href = `${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSDashboard.aspx`
        ;
      }
      else {
        if (group.Title == "IPRS_Contributor") {
          this.IsContributor = true;
          this.ShowAddButton = true;
          this.ShowEditButton = true;
        }
        if (group.Title == "IPRS_Initiator") {
          this.IsInitiator = true;
          this.ShowAddButton = true;
        }
      }
    });


    await this.fetchfromcountrymaster()
    //await this.fetchfromsocietymaster()
    await this.righttypemaster()
    await this.fetchfromgrantmaster()
    await this.fetchfrominclusionmaster()
    await this.fetchfromexclusionmaster()
    await this.fetchthetable()
    this.forselectedoptionSociety()
    this.forselectedoptionRightType()
    this.forselectedoptionCountry()


    this.domElement.querySelector('#btnsubmit').addEventListener('click', () => {
      this.AddDataToIPRSList().then(() => {
        alert("Form has been submitted successfully.")
        window.location.reload();
      });

    })
    this.domElement.querySelector('#cancel-btn').addEventListener('click', () => {
      window.location.reload();
    })
    //var IsNewForm = this.getParameterByName("mode");
    // if (IsNewForm == "Edit") {
    //   $("select.grant-data").val("").prop("disabled", false); ;
    //   $("textarea").val("").prop("disabled", false); ;
    //   $("input.InclusionName-data").val("").prop("disabled", false); 
    //   $("input.ExclusionName-data").val("").prop("disabled", false); 
    //   $("input[type=date]").val("").prop("disabled", false); 
    //   $("input[type=checkbox]").prop("checked", false);
    //   $("input[type=hidden]").val("").prop("disabled", false);

    // }

  }

  //fetch from countrymaster

  private async fetchfromcountrymaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("CountryMaster").items.get();
    console.log(items.length);

    let events = `<option value='' disabled selected >--Select--</option>`

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('countrymaster').innerHTML = events;

  }
  //fetchfromsocietymasterlist
  private async fetchfromsocietymaster(CountryId: any): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("SocietyMaster").items.filter(`Country eq '${CountryId}'`).get();
    console.log(items.length);

    let events = `<option value='' disabled selected >--Select--</option>`

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} - (${items[i].Code})</option>`
      console.log(items[i].Title)

    }

    document.getElementById('societymaster').innerHTML = events;

  }


  //fetchfromrighttypemasterlist
  private async righttypemaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("RightTypeMaster").items.get();
    console.log(items.length);

    let events = `<option value='' disabled selected >--Select--</option>`

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'>${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('righttypemaster').innerHTML = events;
  }

  //forselectedoptionCountry
  private forselectedoptionCountry() {
    var scope = this
    $("#countrymaster").change(function () {

      var selectedCountry = $('option:selected', this).val();
      var selectedSociety = $("#societymaster").val();
      var selectedRightType = $("#righttypemaster").val();

      console.log(selectedCountry)
      if (selectedCountry != null && selectedSociety != null && selectedRightType != null) {
        scope.fetchfromIPRS(selectedCountry, selectedSociety, selectedRightType);
        scope.fetchCityId(selectedCountry, selectedSociety);
        $(".add-newrow-btn").css("pointer-events", "auto");
      }
      scope.fetchfromsocietymaster(selectedCountry);
    });

  }




  //forselectedoptionSociety
  private forselectedoptionSociety() {
    var scope = this
    $("#societymaster").change(function () {
      var selectedSociety = $('option:selected', this).val();
      var selectedRightType = $("#righttypemaster").val();
      var selectedCountry = $("#countrymaster").val();
      console.log(selectedSociety)
      if (selectedCountry != null && selectedSociety != null && selectedRightType != null) {
        scope.fetchfromIPRS(selectedCountry, selectedSociety, selectedRightType);
        scope.fetchCityId(selectedCountry, selectedSociety);
        $(".add-newrow-btn").css("pointer-events", "auto");
      }
    });

  }




  //forselectedoptionRightType
  private forselectedoptionRightType() {
    var scope = this
    $("#righttypemaster").change(function () {
      var selectedRightType = $('option:selected', this).val();
      var selectedSociety = $("#societymaster").val();
      var selectedCountry = $("#countrymaster").val();
      console.log(selectedRightType)
      if (selectedCountry != null && selectedSociety != null && selectedRightType != null) {
        scope.fetchfromIPRS(selectedCountry, selectedSociety, selectedRightType);
        scope.fetchCityId(selectedCountry, selectedSociety);
        $(".add-newrow-btn").css("pointer-events", "auto");
      }
    });

  }

  private async fetchCityId(CountryId: any, SocietyId: any): Promise<any> {
    let items = await sp.web.lists.getByTitle("SocietyMaster").items.filter(`Country eq '${CountryId}' and ID eq '${SocietyId}'`).get();
    let Cityid = items[0].CityId
    this.SelectedCity = Cityid;
  }




  //fetchfromGrantmasterlist
  private async fetchfromgrantmaster(): Promise<void> {
    this.GrantMaster = await sp.web.lists.getByTitle("GrantMaster").items.get();
    console.log(this.GrantMaster)
  }


  //fetchfrominclusionmasterlist
  private async fetchfrominclusionmaster(): Promise<void> {
    this.InclusionMaster = await sp.web.lists.getByTitle("InclusionMaster").items.get();
    console.log(this.InclusionMaster)
  }


  //fetchfromexclusionmasterlist
  private async fetchfromexclusionmaster(): Promise<void> {
    this.ExclusionMaster = await sp.web.lists.getByTitle("ExclusionMaster").items.get();
    console.log(this.ExclusionMaster)
  }


  private async fetchthetable(): Promise<void> {
    this.Sourceitems = await sp.web.lists.getByTitle("SourceMaster").items.get()
    console.log(this.Sourceitems)



    //GrantMasterHTML
    let GrantMasterHTML = `<option value=''>--Select--</option>`;
    for (let i = 0; i < this.GrantMaster.length; i++) {

      GrantMasterHTML += `<option value='${this.GrantMaster[i].ID}'> ${this.GrantMaster[i].Title} </option>`;
      console.log(this.GrantMaster[i].Title)
    }


    //InclusionMasterHTML

    // for (let i = 0; i < this.InclusionMaster.length; i++) {

    //   this.InclusionMasterHTML += `<div class="checkbox">
    //      <label><input type="checkbox" name="type" value="${this.InclusionMaster[i].ID}">${this.InclusionMaster[i].Title}</label>
    //   </div>
    // `;

    //   //console.log(this.InclusionMaster[i].Title)

    // }
    // this.InclusionMasterHTML += `<div class="form-group custom-form-group wpx-250 Add-Custom-Field-Inclusion-DIV">
    //   <input type="text" class="form-control Add-Custom-Field-Inclusion" name="" placeholder="custom text field">
    // </div>`;
    //document.getElementsByClassName('inclusion-Modal-body').innerHTML = InclusionMasterHTML;


    //ExclusionMasterHTML

    // for (let i = 0; i < this.ExclusionMaster.length; i++) {

    //   this.ExclusionMasterHTML += `<div class="checkbox">
    //  <label><input type="checkbox" name="type" value="${this.ExclusionMaster[i].ID}">${this.ExclusionMaster[i].Title}</label>

    //  </div>`;
    //   //console.log(this.ExclusionMaster[i].Title)


    // }
    // this.ExclusionMasterHTML += `<div class="form-group custom-form-group wpx-250 Add-Custom-Field-Exclusion-DIV">
    //   <input type="text" class="form-control Add-Custom-Field-Exclusion" name="" placeholder="custom text field">
    // </div>`;

    //document.getElementById('exclusionID').innerHTML = ExclusionMasterHTML;


    //for loop for fetchfortable
    var scope = this;
    for (let i = 0; i < this.Sourceitems.length; i++) {
      this.table += `
    <tr class="table-row-data">
          <td><span class="source-name">${this.Sourceitems[i].Title}</span>
          <span class="source-id" id="SourceID${i}" hidden>${this.Sourceitems[i].Id}</span>
          </td>
          <td>
          <span id="IsRecord-Edit-New${i}" class="AddOrUpdate" hidden> </span>
          <span id="IPRSListID${i}" class="IPRSId" hidden> </span>
          <div class="inner-field-flex-section">
            <div class="form-group custom-form-group mb0 w-100">
              <select class="form-control grant-data" id="grant-ddl${i}"  disabled>
                ${GrantMasterHTML}
              </select>
          </div>
              </div>
          </td>
          <td>
              <div class="inner-field-flex-section">
                  <div class="form-group custom-form-group mb0 w-100">
                      <input type="text" class="form-control InclusionName-data" name="InclusionDisplayName" id="InclusionDisplayName${i}" value="" disabled readonly>
                      <input type="hidden" class="form-control InclusionName-Id" name="InclusionDisplayName" id="InclusionDisplayID${i}" value="" readonly>
                      <input type="hidden" class="form-control InclusionCustomField-Id" name="InclusionCustomFieldDisplayName" id="InclusionCustomFieldDisplayName${i}" value="" disabled readonly>
                  </div>
                  <div class="project-edit-lock-btn-box ml5">
                      <a type="button" href="#" class="custom-edit-btn disable-anchor-tag" data-toggle="modal" data-target="#inclusionlist${i}" style="pointer-events:none">
                          <i class="fa fa-plus"></i>
                      </a>
                  </div> 
              </div>
          </td>
          <td> 
              <div class="inner-field-flex-section"> 
                  <div class="form-group custom-form-group mb0 w-100">
                  <input type="text" class="form-control ExclusionName-data" name="ExclusionDisplayName" id="ExclusionDisplayName${i}" value="" disabled readonly>
                  <input type="hidden" class="form-control ExclusionName-Id" name="ExclusionDisplayName" id="ExclusionDisplayID${i}" value="" disabled readonly>
                  <input type="hidden" class="form-control ExclusionCustomField-Id" name="ExclusionCustomFieldDisplayName" id="ExclusionCustomFieldDisplayName${i}" value="" disabled readonly>
                  </div>
                  <div class="project-edit-lock-btn-box ml5">
                      <a type="button" href="#" class="custom-edit-btn disable-anchor-tag" data-toggle="modal" data-target="#exclusionlist${i}" style="pointer-events:none">
                          <i class="fa fa-plus"></i>
                      </a>
                  </div>
              </div>
          </td>
          <td>
              <div class="form-group custom-form-group mb0">
                  <input type="date" class="form-control from-date-data" name="" max="9999-12-01" value="" id="from-date${i}" disabled>
              </div>
          </td>
          <td>
              <div class="form-group custom-form-group mb0">
                  <input type="date" class="form-control to-date-data" name="" value="9999-12-01" id="to-date${i}" disabled>
              </div>
          </td>
          <td>
              <div class="form-group custom-form-group mb0">
                  <textarea class="form-control resize-none remark-data" rows="3" id="Remark${i}" placeholder="type here" disabled maxlength="150"></textarea>
              </div>
          </td>
          <td>
              <div class="reciprocal-action-btn-box">
              ${(this.ShowEditButton) ? `<a type="button" href="#" class="custom-edit-btn mr15 disable-anchor-edit-btn Edit-row-disable" id="edit${i}" style="pointer-events:none">
                                    <i class="fa fa-pencil"></i>
                                                     </a>`: ""}    
              ${(this.ShowAddButton) ? `<a type="button" href="#" class="custom-edit-btn add-newrow-btn" id="newrow${i}" style="pointer-events:none">
                                    <i class="fa fa-plus"></i>
                                                  </a>`: ""}        
              </div>
          </td>
</tr>
`
      $(document).on('change', `#to-date${i}`, async function (this) {
        let ToDate: any = $(this).val();
        $(this).closest('tr').find("input[type=date].from-date-data").attr('max', ToDate);

      })

      $(document).on('click', `#newrow${i}`, async function (this) {
        let answer = window.confirm("Do you want to add New Record?");
        if (answer == true) {
          $(this).closest('tr').find("input:text,input[type=date].from-date-data,textarea").val("");
          $(this).closest('tr').find("input[type=date].to-date-data").val("9999-12-01");
          $(this).closest('tr').find("input,textarea,select").prop('disabled', false);
          $(this).closest('tr').find(".disable-anchor-tag").css("pointer-events", "auto");
          $(this).closest('tr').find("select.grant-data").val("");
          //$(this).closest('tr').find("input[type=checkbox]").prop("checked", false);
          $(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]").prop("checked", false);
          $(`#exclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]").prop("checked", false);
          $(`#inclusionID${i}`).find("input.Add-Custom-Field-Inclusion").val("");
          $(`#exclusionID${i}`).find("input.Add-Custom-Field-Exclusion").val("");

          $(`#IsRecord-Edit-New${i}`).text("New");
        }

      })
      //var scope = this;
      $(document).on('click', `#edit${i}`, async function (this) {
        let answer = window.confirm("Do you want to Edit this Record?");
        if (answer == true) {
          $(`#IsRecord-Edit-New${i}`).text("Edit");
          $(this).closest('tr').find("input,textarea,select").prop('disabled', false);
          $(this).closest('tr').find(".disable-anchor-tag").css("pointer-events", "auto");
        }

      })
      {
        this.modalHTMLInclusion += `<div id="inclusionlist${i}" class="modal fade" role="dialog">
<div class="modal-dialog">

  <!-- Modal content-->
  <div class="modal-content reciprocal-custom-modal">
    <div class="modal-header">
       <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>
      <h4 class="modal-title">Add Inclusions</h4>
    </div>
    <div class="modal-body" id="inclusionID${i}" class="inclusion-Modal-body">
      ${this.InclusionMaster.map((items) => {
          return ((items.SourceId.includes(this.Sourceitems[i].Id)) ? `<div class="checkbox">
           <label><input type="checkbox" name="type" value="${items.ID}" id="Inclusion-Checkbox${i}">${items.Title}</label>
         </div>` : '')
        }).join('')}
      <div class="form-group custom-form-group wpx-250 Add-Custom-Field-Inclusion-DIV">
       <input type="text" class="form-control Add-Custom-Field-Inclusion" name="" placeholder="custom text field" disabled>
     </div>
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90" id="Add-btn-modal-inclusion${i}">Add</button>
    </div>
  </div>
</div>
</div>`

        $(document).on('click', `#Inclusion-Checkbox${i}`, async function (this) {
          if ($(this).closest("label").text() == scope.CustomFieldGlobalName) {
            $(`#inclusionID${i}`).find("input.Add-Custom-Field-Inclusion").prop("disabled", false)
          }
        })

        $(document).on('click', `#Add-btn-modal-inclusion${i}`, async function (this) {

          //  var checkedInclusion :any = '';
          //  checkedInclusion = $(`#inclusionID${i}`).find("div.checkbox").find("input:checked").val();

          var arrayinclusion: any[] = [];
          var arrayinclusionName: any[] = [];
          var CustomFieldNameInclusion: any = $(`#inclusionID${i}`).find("input.Add-Custom-Field-Inclusion").val();
          $(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function () {
            //checking if checkbox = others and text area is blank or not.
            if ($(this).closest("label").text() == scope.CustomFieldGlobalName && CustomFieldNameInclusion != "") {
              arrayinclusionName.push($(this).closest("label").text().replace(scope.CustomFieldGlobalName, CustomFieldNameInclusion))
              arrayinclusion.push($(this).val());
            }
            //checking if checkbox != others
            else if ($(this).closest("label").text() != scope.CustomFieldGlobalName) {
              arrayinclusionName.push($(this).closest("label").text())
              arrayinclusion.push($(this).val());
            }
//checking if checkbox is checked on others and if value of others is blank 
            if ($(this).closest("label").text() == scope.CustomFieldGlobalName && CustomFieldNameInclusion == "" && $(this).is(":checked")) {
              $(this).prop("checked", false);
              $(`#inclusionID${i}`).find("input.Add-Custom-Field-Inclusion").prop("disabled", true);
              alert("Please enter the value of others for Inclusion");
            }

          });

          $(`#InclusionDisplayName${i}`).val(arrayinclusionName)
          $(`#InclusionDisplayID${i}`).val(arrayinclusion)
          console.log(arrayinclusion, arrayinclusionName)
          $(`#InclusionCustomFieldDisplayName${i}`).val(CustomFieldNameInclusion);
        });
      }

      {
        this.modalHTMLExclusion += ` <div id="exclusionlist${i}" class="modal fade" role="dialog">
<div class="modal-dialog"> 

  <!-- Modal content-->
  <div class="modal-content reciprocal-custom-modal">
    <div class="modal-header">
    <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">×</span></button>  
      <h4 class="modal-title">Add Exclusions</h4>
    </div>
    <div class="modal-body" id="exclusionID${i}">  
    ${this.ExclusionMaster.map((items) => {
          return ((items.SourceId.includes(this.Sourceitems[i].Id)) ? `<div class="checkbox">
          <label><input type="checkbox" name="type" value="${items.ID}" id="Exclusion-Checkbox${i}">${items.Title}</label>
        </div>` : '')
        }).join('')}
     <div class="form-group custom-form-group wpx-250 Add-Custom-Field-Exclusion-DIV">
      <input type="text" class="form-control Add-Custom-Field-Exclusion" name="" placeholder="custom text field" disabled>
     </div>
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90" id="Add-btn-modal-exclusion${i}">Add</button>
    </div>
  </div> 
</div>
</div>`

        $(document).on('click', `#Exclusion-Checkbox${i}`, async function (this) {
          if ($(this).closest("label").text() == scope.CustomFieldGlobalName) {
            $(`#exclusionID${i}`).find("input.Add-Custom-Field-Exclusion").prop("disabled", false)
          }
        })
        $(document).on('click', `#Add-btn-modal-exclusion${i}`, async function (this) {

          var arrayexclusion: any[] = [];
          var arrayexclusionName: any[] = [];
          var CustomFieldNameExclusion: any = $(`#exclusionID${i}`).find("input.Add-Custom-Field-Exclusion").val();
          $(`#exclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function () {
            //checking if checkbox = others and text area is blank or not.
            if ($(this).closest("label").text() == scope.CustomFieldGlobalName && CustomFieldNameExclusion != "") {
              arrayexclusionName.push($(this).closest("label").text().replace(scope.CustomFieldGlobalName, CustomFieldNameExclusion))
              arrayexclusion.push($(this).val());
            }
            //checking if checkbox != others
            else if ($(this).closest("label").text() != scope.CustomFieldGlobalName) {
              arrayexclusionName.push($(this).closest("label").text())
              arrayexclusion.push($(this).val());
            }
         //checking if checkbox is checked on others and if value of others is blank
            if ($(this).closest("label").text() == scope.CustomFieldGlobalName && CustomFieldNameExclusion == "" && $(this).is(":checked")) {
              $(this).prop("checked", false);
              $(`#exclusionID${i}`).find("input.Add-Custom-Field-Exclusion").prop("disabled", true);
              alert("Please enter the value of others for Exclusion");
            }

          });

          $(`#ExclusionDisplayName${i}`).val(arrayexclusionName);
          $(`#ExclusionDisplayID${i}`).val(arrayexclusion);

          $(`#ExclusionCustomFieldDisplayName${i}`).val(CustomFieldNameExclusion);
          console.log(arrayexclusion, arrayexclusionName)
        })
      }



      document.getElementById('data').innerHTML = this.table;
      document.getElementById('modal-list-collection-inclusion').innerHTML = this.modalHTMLInclusion;
      document.getElementById('modal-list-collection-exclusion').innerHTML = this.modalHTMLExclusion;
      //$(`#inclusionID${i}`).html(InclusionMasterHTML);
    }

  }


  private async fetchfromIPRS(countryid: any, societyid: any, rightTypeid: any): Promise<void> {
    // const items: any[] = await sp.web.lists.getByTitle("IPRS").items.filter(`RightTypeId eq '${rightTypeid}' and SocietyId eq '${societyid}'`)
    //   .get();
    // console.log(items)
    ////Clearing input fields
    $("select.grant-data").val("");
    $("select.grant-data").prop('disabled', true);
    $("textarea").val("");
    $("textarea").prop('disabled', true);
    //$("input").val();
    $("input.InclusionName-data").val("");
    $("input.ExclusionName-data").val("");
    $("input[type=date].from-date-data").val("");
    $("input[type=date].to-date-data").val("9999-12-01");
    $("input[type=date]").prop('disabled', true);
    $("input[type=checkbox]").prop("checked", false);
    $("input[type=hidden]").val("");
    $(".disable-anchor-tag").css("pointer-events", "none");
    $("span.IPRSId").text("");
    $("span.AddOrUpdate").text("");
    $("a.Edit-row-disable").css("pointer-events", "none");
    $("input.Add-Custom-Field-Inclusion").val("");
    $("input.Add-Custom-Field-Exclusion").val("");
    const item: any[] = await sp.web.lists.getByTitle("IPRS").items
      .select("*, RightType/Title,Society/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title")
      .expand("RightType,Society,Source,Grant,Inclusion,Exclusion")
      .filter(`RightType eq '${rightTypeid}' and Society eq '${societyid}' and Country eq '${countryid}'`).orderBy("Created", false)
      .get();
    // item.sort(function (a: any, b: any): number {
    //   if (a.ValidFrom > b.ValidFrom) { return -1; }
    //   if (a.ValidFrom < b.ValidFrom) { return 1; }
    // })
    let distinctArr: any[] = [];
    let isInArr: boolean = false;
    item.forEach((val, ind) => {
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


    for (let i = 0; i < this.Sourceitems.length; i++) {
      distinctArr.forEach((val, ind) => {
        if (val.SourceId == this.Sourceitems[i].Id) {
          // let Inclusionhtml ='';
          let InclusionName: any[] = [];

          val.Inclusion.forEach((inclus: any) => {
            InclusionName.push(inclus.Title);
            $(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]").each(function () {
              if ($(this).closest("label").text() == inclus.Title) {
                $(this).prop("checked", true);
              }
            });
          });


          $(`#edit${i}`).css("pointer-events", "auto");
          $(`#inclusionID${i}`).find("input.Add-Custom-Field-Inclusion").val(val.CustomInclusion);
          $("#InclusionCustomFieldDisplayName" + i).val(val.CustomInclusion);
          let index = InclusionName.indexOf(this.CustomFieldGlobalName);
          var NewInclusionName = InclusionName;
          if (index != -1) {
            InclusionName[index] = val.CustomInclusion;
            NewInclusionName = InclusionName;
          }
          $("#InclusionDisplayName" + i).val(NewInclusionName);
          $("#InclusionDisplayID" + i).val(val.InclusionId);
          $(`#Remark${i}`).val(val.Remarks);
          const select: any = document.querySelector(`#grant-ddl${i}`);
          select.value = val.GrantId;

          let FromDT = moment(val.ValidFrom).format("YYYY-MM-DD");
          $(`#from-date${i}`).val(FromDT);
          let ToDT = moment(val.ValidTill).format("YYYY-MM-DD");
          $(`#to-date${i}`).val(ToDT);
          $(`#IPRSListID${i}`).text(val.ID)



          let ExclusionName: any[] = [];
          val.Exclusion.forEach((inclus: any) => {
            ExclusionName.push(inclus.Title)
            $(`#exclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]").each(function () {
              if ($(this).closest("label").text() == inclus.Title) {
                $(this).prop("checked", true);
              }
            });
          })
          $(`#exclusionID${i}`).find("input.Add-Custom-Field-Exclusion").val(val.CustomExclusion);
          $("#ExclusionCustomFieldDisplayName" + i).val(val.CustomExclusion);
          let indexExclusion = ExclusionName.indexOf(this.CustomFieldGlobalName)
          var NewExclusionName = ExclusionName;
          if (indexExclusion != -1) {
            ExclusionName[indexExclusion] = val.CustomExclusion;
            NewExclusionName = ExclusionName;
          }
          $("#ExclusionDisplayName" + i).val(NewExclusionName);
          $("#ExclusionDisplayID" + i).val(val.ExclusionId);
        }
      })

    }



    /////////////////////

    //let arr: any[] =[];
    //     let arrobj = _.groupBy(item, "SourceId")
    //     console.log(item, arrobj);


    //     for (let key in arrobj) {
    //       //console.log(key, arrobj[key]);
    //       arrobj[key].forEach((val, i) => {
    //         let InclusionName: any[] = [];
    //         val.Inclusion.forEach((inclus: any) => {
    //           InclusionName.push(inclus.Title)
    //         })
    //         let ExclusionName: any[] = [];
    //         val.Exclusion.forEach((inclus: any) => {
    //           ExclusionName.push(inclus.Title)
    //         })

  }

  private AddDataToIPRSList(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let loopCount: number = 0;
      var CityId: any = this.SelectedCity;
      var societyid: any = $("#societymaster").val();
      var rightTypeid: any = $("#righttypemaster").val();
      var countryid: any = $("#countrymaster").val();
      var scope = this;
      
      scope.CheckMandatoryField(countryid, societyid, rightTypeid, null, null, null, null);
  
      $("#data tr.table-row-data").each(function () {
        loopCount = loopCount + 1;
        var grant: any = $(this).find("select.grant-data").val();
        var inclusionID: any = $(this).find("input.InclusionName-Id").val();
        var CustomFieldInclusionText: any = $(this).find("input.InclusionCustomField-Id").val();
        var exclusionID: any = $(this).find("input.ExclusionName-Id").val();
        var CustomFieldExclusionText: any = $(this).find("input.ExclusionCustomField-Id").val();
        var validFrom: any = $(this).find("input.from-date-data").val();
        var validTo: any = $(this).find("input.to-date-data").val();
        var Remark: any = $(this).find("textarea.remark-data").val();
        var IsAddOrUpdate: any = $(this).find("span.AddOrUpdate").text();
        var IPRSId: any = $(this).find("span.IPRSId").text();
        var sourceID: any = $(this).find("span.source-id").text();
        var sourceName: any = $(this).find("span.source-name").text();
        inclusionID = inclusionID.split(",");
        exclusionID = exclusionID.split(",");
        if (inclusionID == "") {
          inclusionID = [];
        }
        if (exclusionID == "") {
          exclusionID = [];
        }
        if (IsAddOrUpdate == "Edit") {
          scope.CheckMandatoryField(countryid, societyid, rightTypeid, grant, validFrom, validTo, sourceName)
            .then(() => {
              sp.web.lists.getByTitle("IPRS").items.getById(IPRSId).update({
                GrantId: grant,
                //SourceId: sourceID,
                InclusionId: { results: inclusionID },
                ExclusionId: { results: exclusionID },
                ValidFrom: validFrom,
                ValidTill: validTo,
                Remarks: Remark,
                // SocietyId: societyid,
                // RightTypeId: rightTypeid,
                CustomInclusion: CustomFieldInclusionText,
                CustomExclusion: CustomFieldExclusionText,
                CityId: CityId
              }).then(() => {
                console.log("Line Item updated of id" + IPRSId);
                if (loopCount == $("#data tr.table-row-data").length) {
                  resolve("");
                }
              })
                .catch((err) => {
                  console.log("error" + err);
                 
                  
                }).catch((err) => {
                  //catch for check mandatory field function
                  console.log("error" + err)
                  reject("");
                })
            })
        }
        else if (IsAddOrUpdate == "New") {
          scope.CheckMandatoryField(countryid, societyid, rightTypeid, grant, validFrom, validTo, sourceName)
            .then(() => {
              sp.web.lists.getByTitle("IPRS").items.add({
                GrantId: grant,
                SourceId: sourceID,
                InclusionId: { results: inclusionID },
                ExclusionId: { results: exclusionID },
                ValidFrom: validFrom,
                ValidTill: validTo,
                Remarks: Remark,
                SocietyId: societyid,
                RightTypeId: rightTypeid,
                CountryId: countryid,
                CityId: CityId,
                CustomInclusion: CustomFieldInclusionText,
                CustomExclusion: CustomFieldExclusionText
              }).then(() => {
                console.log(" New Line Item submitted ");
                if (loopCount == $("#data tr.table-row-data").length) {
                  resolve("");
                }
              })
                .catch((err) => {
                  //catch for list Submit
                  console.log("error" + err)
                  

                })

            }).catch((err) => {
              //catch for check mandatory field function
              console.log("error" + err)
              reject("");
            })
        }
      })
    })

  }

  private CheckMandatoryField(countryid: any, societyid: any, rightTypeid: any, Grantid: string, validFrom: string, validTo: string, sourceName: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (countryid == null) {
        alert("Please fill Country.");
        reject(false);
      }
      else if (societyid == null) {
        alert("Please fill Society.");
        reject(false);
      }
      else if (rightTypeid == null) {
        alert("Please fill RightType.");
        reject(false);
      }
      else if (Grantid == "") {
        alert("Please fill Grant.");
        reject(false);
      }
      else if (validFrom == "") {
        alert("Please fill Valid From.")
        reject(false);
      }
      else if (validTo == "") {
        alert("Please fill Valid Till")
        reject(false);
      }
      else if (new Date(moment(validFrom).format("YYYY-MM-DD")).getTime() >= new Date(moment(validTo).format("YYYY-MM-DD")).getTime()) {
        alert("Valid From should be smaller than Valid Till of " + sourceName)
        reject(false);
      }
      else {
        resolve(true);
      }
    })

  }

  public getParameterByName(name: any, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  // private async AddCustomFieldToInclusionMaster(CustomField: any) {
  //   sp.web.lists.getByTitle("InclusionMaster").items.add({
  //     Title: CustomField
  //   })
  //     .then((response) => {
  //       console.log(response);
  //     })
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
