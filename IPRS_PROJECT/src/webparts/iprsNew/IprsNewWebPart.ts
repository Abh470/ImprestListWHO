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
  public GrantMaster: any[];
  public InclusionMaster: any[];
  public ExclusionMaster: any[];
  public TestGit:string[];
  public TestGITBYMAYUR :any[];
  public table =
    `<thead>
    <tr>
    <th class="w-10-th">Source <span class="text-red">*</span></th>
    <th class="w-10-th">Grant</th>
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


  public async render(): Promise<void> {

    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css');

    this.domElement.innerHTML = `
    <div class="container-fluid">
    <div class="custom-panel">
        <div class="panel-head">
            <h1 class="panel-head-text">Reciprocal Add Screen</h1>
        </div>
        <div class="panel-body">
            <div class="row mt25">
                <div class="col-md-3 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Society:</label>
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
                <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/IPRSDashboard.aspx" type="button" class="btn custom-btn-two-cancel wpx-90">Cancel</a>
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
    await this.fetchfromsocietymaster()
    await this.righttypemaster()
    await this.fetchfromgrantmaster()
    await this.fetchfrominclusionmaster()
    await this.fetchfromexclusionmaster()
    await this.fetchthetable()
    this.forselectedoptionSociety()
    this.forselectedoptionRightType()


    this.domElement.querySelector('#btnsubmit').addEventListener('click', () => {
      this.AddDataToIPRSList().then(() => {
        alert("Form has been submitted successfully.")
      });

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



  //fetchfromsocietymasterlist
  private async fetchfromsocietymaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("SocietyMaster").items.get();
    console.log(items.length);

    let events = `<option value=''>--Select--</option>`

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('societymaster').innerHTML = events;

  }


  //fetchfromrighttypemasterlist
  private async righttypemaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("RightTypeMaster").items.get();
    console.log(items.length);

    let events = `<option value=''>--Select--</option>`

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'>${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('righttypemaster').innerHTML = events;
  }


  //forselectedoptionSociety
  private forselectedoptionSociety() {
    var scope = this
    $("#societymaster").change(function () {
      var selectedSociety = $('option:selected', this).val();
      var selectedRightType = $("#righttypemaster").val();
      console.log(selectedSociety)
      scope.fetchfromIPRS(selectedSociety, selectedRightType)
    });

  }


  //forselectedoptionRightType
  private forselectedoptionRightType() {
    var scope = this
    $("#righttypemaster").change(function () {
      var selectedRightType = $('option:selected', this).val();
      var selectedSociety = $("#societymaster").val();
      console.log(selectedRightType)
      scope.fetchfromIPRS(selectedSociety, selectedRightType)
    });

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

    for (let i = 0; i < this.InclusionMaster.length; i++) {

      this.InclusionMasterHTML += `<div class="checkbox">
    <label><input type="checkbox" name="type" value="${this.InclusionMaster[i].ID}">${this.InclusionMaster[i].Title}</label>
 
    </div>`;

      //console.log(this.InclusionMaster[i].Title)


    }
    //document.getElementsByClassName('inclusion-Modal-body').innerHTML = InclusionMasterHTML;


    //ExclusionMasterHTML

    for (let i = 0; i < this.ExclusionMaster.length; i++) {

      this.ExclusionMasterHTML += `<div class="checkbox">
     <label><input type="checkbox" name="type" value="${this.ExclusionMaster[i].ID}">${this.ExclusionMaster[i].Title}</label>
  
     </div>`;
      //console.log(this.ExclusionMaster[i].Title)


    }
    //document.getElementById('exclusionID').innerHTML = ExclusionMasterHTML;


    //for loop for fetchfortable
    for (let i = 0; i < this.Sourceitems.length; i++) {
      this.table += `
    <tr class="table-row-data">
          <td class="ellipsis-2">${this.Sourceitems[i].Title}
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
                  </div>
                  <div class="project-edit-lock-btn-box ml5">
                      <a type="button" href="#" class="custom-edit-btn disable-anchor-tag" data-toggle="modal" data-target="#inclusionlist${i}">
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
                  </div>
                  <div class="project-edit-lock-btn-box ml5">
                      <a type="button" href="#" class="custom-edit-btn disable-anchor-tag" data-toggle="modal" data-target="#exclusionlist${i}" >
                          <i class="fa fa-plus"></i>
                      </a>
                  </div>
              </div>
          </td>
          <td>
              <div class="form-group custom-form-group mb0">
                  <input type="date" class="form-control from-date-data" name="" value="" id="from-date${i}" disabled>
              </div>
          </td>
          <td>
              <div class="form-group custom-form-group mb0">
                  <input type="date" class="form-control to-date-data" name="" value="" id="to-date${i}" disabled>
              </div>
          </td>
          <td>
              <div class="form-group custom-form-group mb0">
                  <textarea class="form-control resize-none remark-data" rows="3" id="Remark${i}" placeholder="type here" disabled></textarea>
              </div>
          </td>
          <td>
              <div class="reciprocal-action-btn-box">
                  <a type="button" href="#" class="custom-edit-btn mr15" id="edit${i}" disabled>
                      <i class="fa fa-pencil"></i>
                  </a>
                  <a type="button" href="#" class="custom-edit-btn" id="newrow${i}" disabled>
                      <i class="fa fa-plus"></i>
                  </a>
              </div>
          </td>
</tr>
`
      $(document).on('click', `#newrow${i}`, async function (this) {
        let answer = window.prompt("Do you want to add New Record", "Confirm");
        if (answer != null) {
          $(this).closest('tr').find("input,textarea").val("");
          $(this).closest('tr').find("input,textarea,select").prop('disabled', false);
          $(this).closest('tr').find(".disable-anchor-tag").css("pointer-events", "auto");
          $(this).closest('tr').find("select.grant-data").val("");
          //$(this).closest('tr').find("input[type=checkbox]").prop("checked", false);
          $(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]").prop("checked", false);
          $(`#exclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]").prop("checked", false);

          $(`#IsRecord-Edit-New${i}`).text("New");
        }

      })
      $(document).on('click', `#edit${i}`, async function (this) {
        let answer = window.prompt("Do you want to Edit this Record", "Confirm");
        if (answer != null) {
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
      ${this.InclusionMasterHTML}
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90" id="Add-btn-modal-inclusion${i}">Add</button>
    </div>
  </div>
</div>
</div>`
        $(document).on('click', `#Add-btn-modal-inclusion${i}`, async function (this) {

          //  var checkedInclusion :any = '';
          //  checkedInclusion = $(`#inclusionID${i}`).find("div.checkbox").find("input:checked").val();

          var arrayinclusion: any[] = [];
          var arrayinclusionName: any[] = [];
          $(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function () {
            arrayinclusionName.push($(this).closest("label").text())
            arrayinclusion.push($(this).val());



          });
          $(`#InclusionDisplayName${i}`).val(arrayinclusionName)
          $(`#InclusionDisplayID${i}`).val(arrayinclusion)
          console.log(arrayinclusion, arrayinclusionName)
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
     ${this.ExclusionMasterHTML}
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90" id="Add-btn-modal-exclusion${i}">Add</button>
    </div>
  </div>
</div>
</div>`
        $(document).on('click', `#Add-btn-modal-exclusion${i}`, async function (this) {

          var arrayexclusion: any[] = [];
          var arrayexclusionName: any[] = [];
          $(`#exclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function () {
            arrayexclusionName.push($(this).closest("label").text())
            arrayexclusion.push($(this).val());

            $(`#ExclusionDisplayName${i}`).val(arrayexclusionName);
            $(`#ExclusionDisplayID${i}`).val(arrayexclusion);
          });
          console.log(arrayexclusion, arrayexclusionName)
        })
      }



      document.getElementById('data').innerHTML = this.table;
      document.getElementById('modal-list-collection-inclusion').innerHTML = this.modalHTMLInclusion;
      document.getElementById('modal-list-collection-exclusion').innerHTML = this.modalHTMLExclusion;
      //$(`#inclusionID${i}`).html(InclusionMasterHTML);
    }

  }


  private async fetchfromIPRS(societyid: any, rightTypeid: any): Promise<void> {
    // const items: any[] = await sp.web.lists.getByTitle("IPRS").items.filter(`RightTypeId eq '${rightTypeid}' and SocietyId eq '${societyid}'`)
    //   .get();
    // console.log(items)
    ////Clearing input fields
    $("select.grant-data").val("");
    $("textarea").val("");
    //$("input").val();
    $("input.InclusionName-data").val("");
    $("input.ExclusionName-data").val("");
    $("input[type=date]").val("");
    $("input[type=checkbox]").prop("checked", false);
    $("input[type=hidden]").val("");
    $(".disable-anchor-tag").css("pointer-events", "none");
    const item: any[] = await sp.web.lists.getByTitle("IPRS").items
      .select("*, RightType/Title,Society/Title,Source/Title,Grant/Title,Inclusion/Title,Exclusion/Title")
      .expand("RightType,Society,Source,Grant,Inclusion,Exclusion")
      .filter(`RightType eq '${rightTypeid}' and Society eq '${societyid}'`).orderBy("Created", false)
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
          let InclusionName: any[] = [];
          val.Inclusion.forEach((inclus: any) => {
            InclusionName.push(inclus.Title);
            $(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]").each(function () {
              if ($(this).closest("label").text() == inclus.Title) {
                $(this).prop("checked", true);
              }
            });


          });
          $("#InclusionDisplayName" + i).val(InclusionName);
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
          $("#ExclusionDisplayName" + i).val(ExclusionName);
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
      $("#data tr.table-row-data").each(function () {
        loopCount = loopCount + 1;
        var grant: any = $(this).find("select.grant-data").val();
        var inclusionID: any = $(this).find("input.InclusionName-Id").val();
        var exclusionID: any = $(this).find("input.ExclusionName-Id").val();
        var validFrom: any = $(this).find("input.from-date-data").val();
        var validTo: any = $(this).find("input.to-date-data").val();
        var Remark: any = $(this).find("textarea.remark-data").val();
        var IsAddOrUpdate: any = $(this).find("span.AddOrUpdate").text();
        var IPRSId: any = $(this).find("span.IPRSId").text();
        var sourceID: any = $(this).find("span.source-id").text();
        inclusionID = inclusionID.split(",");
        exclusionID = exclusionID.split(",");
        var societyid: any = $("#societymaster").val();
        var rightTypeid: any = $("#righttypemaster").val();

        if (IsAddOrUpdate == "Edit") {
          sp.web.lists.getByTitle("IPRS").items.getById(IPRSId).update({
            GrantId: grant,
            SourceId: sourceID,
            InclusionId: { results: inclusionID },
            ExclusionId: { results: exclusionID },
            ValidFrom: validFrom,
            ValidTill: validTo,
            Remarks: Remark,
            SocietyId: societyid,
            RightTypeId: rightTypeid
          }).then(() => {
            console.log("Line Item updated of id" + IPRSId);
            if (loopCount == $("#data tr.table-row-data").length) {
              resolve("");
            }
          })
            .catch((err) => {
              console.log("error" + err)
            })
        }
        else if (IsAddOrUpdate == "New") {
          sp.web.lists.getByTitle("IPRS").items.add({
            GrantId: grant,
            SourceId: sourceID,
            InclusionId: { results: inclusionID },
            ExclusionId: { results: exclusionID },
            ValidFrom: validFrom,
            ValidTill: validTo,
            Remarks: Remark,
            SocietyId: societyid,
            RightTypeId: rightTypeid
          }).then(() => {
            console.log(" New Line Item submitted ");
            if (loopCount == $("#data tr.table-row-data").length) {
              resolve("");
            }
          })
            .catch((err) => {
              console.log("error" + err)
            })
        }
      });


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
