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
public ExclusionMasterHTML =``;
public modalHTMLExclusion =``;
public InclusionMasterHTML =``;
public modalHTMLInclusion=``;
  

   public async render(): Promise<void> {

    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css');

    this.domElement.innerHTML =`
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
                            <select class="form-control"id="righttypemaster">
                              
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row mt15">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                            <table class="table mb0 custom-table" id="data">
                                </table>
                        </div>  
                    </div>
                </div>
<div id ="modal-list-collection-inclusion">
</div>

  <div id ="modal-list-collection-exclusion">
  </div>


  <div class="mt20 text-center">
        <button type="button" data-dismiss="modal" class="btn custom-btn mr5 wpx-90" id ="btnsubmit">Submit</button>
        <a href="career-dashboard.html" type="button" class="btn custom-btn-two-cancel wpx-90">Cancel</a>
    </div>
        `           
   
   await this.fetchfromsocietymaster()
   await this.righttypemaster()
   await this.fetchfromgrantmaster()
   await this.fetchfrominclusionmaster()
   await this.fetchfromexclusionmaster()
   await this.fetchthetable()
   this.forselectedoptionSociety()
   this.forselectedoptionRightType()
   this.fetchfromIPRS()

  //  this.domElement.querySelector('#btnSubmit').addEventListener('click', () => {
  //   this.submitdata()
    
  // })

}

   

//fetchfromsocietymasterlist
   private async fetchfromsocietymaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("SocietyMaster").items.get();
    console.log(items.length);

    let events = ``

    for (let i = 0; i < items.length; i++) {

      events += `<option value=${items[i].ID}>${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('societymaster').innerHTML = events;

  }


//fetchfromrighttypemasterlist
  private async righttypemaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("RightTypeMaster").items.get();
    console.log(items.length);

    let events = ``

    for (let i = 0; i < items.length; i++) {

      events += `<option value=${items[i].ID}>${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('righttypemaster').innerHTML = events;
 }


//forselectedoptionSociety
private forselectedoptionSociety() {
 var scope = this
   $("#societymaster").change(function() {
    var selectedSociety = $('option:selected', this).val();
    console.log(selectedSociety)
    scope.fetchfromIPRS()
});

}


//forselectedoptionRightType
private forselectedoptionRightType(){
  var scope = this
  $("#righttypemaster").change(function() {
    var selectedRightType =  $('option:selected', this).val() ;
    console.log(selectedRightType)
    scope.fetchfromIPRS()
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


private async fetchthetable(): Promise<void>{
    const items: any[] = await sp.web.lists.getByTitle("SourceMaster").items.get()
    console.log(items)

    

//GrantMasterHTML
let GrantMasterHTML =`<option value=''>--Select--</option>`;
for (let i = 0; i < this.GrantMaster.length; i++) {

    GrantMasterHTML += `<option value='${this.GrantMaster[i].ID}'>${this.GrantMaster[i].Title} </option>`;
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
for(let i=0; i<items.length; i++)
{
    this.table += `
    <tbody>
    <tr>
    <td class="ellipsis-2">${items[i].Title}</td>
    <td>
    <div class="inner-field-flex-section">
      <div class="form-group custom-form-group mb0 w-100">
        <select class="form-control">
           ${GrantMasterHTML}
        </select>
     </div>
        </div>
    </td>
    <td>
        <div class="inner-field-flex-section">
            <div class="form-group custom-form-group mb0 w-100">
                <input type="text" class="form-control" name="InclusionDisplayName" id="InclusionDisplayName${i}" value="">
                <input type="hidden" class="form-control" name="InclusionDisplayName" id="InclusionDisplayID${i}" value="">
            </div>
            <div class="project-edit-lock-btn-box ml5">
                <a type="button" href="#" class="custom-edit-btn" data-toggle="modal" data-target="#inclusionlist${i}">
                    <i class="fa fa-plus"></i>
                </a>
            </div>
        </div>
    </td>
    <td>
        <div class="inner-field-flex-section">
            <div class="form-group custom-form-group mb0 w-100">
            <input type="text" class="form-control" name="InclusionDisplayName" id="ExclusionDisplayName${i}" value="">
            <input type="hidden" class="form-control" name="InclusionDisplayName" id="ExclusionDisplayID${i}" value="">
            </div>
            <div class="project-edit-lock-btn-box ml5">
                <a type="button" href="#" class="custom-edit-btn" data-toggle="modal" data-target="#exclusionlist${i}">
                    <i class="fa fa-plus"></i>
                </a>
            </div>
        </div>
    </td>
    <td>
        <div class="form-group custom-form-group mb0">
            <input type="date" class="form-control" name="" value="">
        </div>
    </td>
    <td>
        <div class="form-group custom-form-group mb0">
            <input type="date" class="form-control" name="" value="">
        </div>
    </td>
    <td>
        <div class="form-group custom-form-group mb0">
            <textarea class="form-control resize-none" rows="3" id="" placeholder="type here"></textarea>
        </div>
    </td>
    <td>
        <div class="reciprocal-action-btn-box">
            <a type="button" href="#" class="custom-edit-btn mr15" id="edit${i}">
                <i class="fa fa-pencil"></i>
            </a>
            <a type="button" href="#" class="custom-edit-btn" id="newrow${i}">
                <i class="fa fa-plus"></i>
            </a>
        </div>
    </td>
</tr>
<tbody>`
{
  this.modalHTMLInclusion +=`<div id="inclusionlist${i}" class="modal fade" role="dialog">
<div class="modal-dialog">

  <!-- Modal content-->
  <div class="modal-content reciprocal-custom-modal">
    <div class="modal-header">
       <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">&#10060;</span></button>
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

var arrayinclusion:any[] = [];
var arrayinclusionName:any[] = [];
$(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function() {
  arrayinclusionName.push($(this).closest("label").text())
  arrayinclusion.push($(this).val());
  
 

});
$(`#InclusionDisplayName${i}`).val(arrayinclusionName)
$(`#InclusionDisplayID${i}`).val(arrayinclusion)
            console.log(arrayinclusion,arrayinclusionName)
 });
}

{
  this.modalHTMLExclusion +=` <div id="exclusionlist${i}" class="modal fade" role="dialog">
<div class="modal-dialog">

  <!-- Modal content-->
  <div class="modal-content reciprocal-custom-modal">
    <div class="modal-header">
    <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">&#10060;</span></button>  
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

  var arrayexclusion:any[] = [];
  var arrayexclusionName:any[] = [];
  $(`#exclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function() {
    arrayexclusionName.push($(this).closest("label").text())
    arrayexclusion.push($(this).val());

$(`#ExclusionDisplayName${i}`).val(arrayexclusionName)
$(`#ExclusionDisplayID${i}`).val(arrayexclusion)
              });
              console.log(arrayexclusion,arrayexclusionName)
   })
  }



document.getElementById('data').innerHTML = this.table;
document.getElementById('modal-list-collection-inclusion').innerHTML = this.modalHTMLInclusion;
document.getElementById('modal-list-collection-exclusion').innerHTML = this.modalHTMLExclusion;
//$(`#inclusionID${i}`).html(InclusionMasterHTML);
}

}


private async fetchfromIPRS(): Promise<void>{
  const items: any[] = await sp.web.lists.getByTitle("IPRS").items.filter("RightTypeId eq '3' and SocietyId eq '3'").get()
  console.log(items)
 
 
  for(let i=0; i<items.length; i++)
{
    this.table += `
    <tbody>
    <tr>
    <td class="ellipsis-2">${items[i].Title}</td>
    <td>
    <div class="inner-field-flex-section">
      <div class="form-group custom-form-group mb0 w-100">
        <select class="form-control">
           
        </select>
     </div>
        </div>
    </td>
    <td>
        <div class="inner-field-flex-section">
            <div class="form-group custom-form-group mb0 w-100">
                <input type="text" class="form-control" name="InclusionDisplayName" id="InclusionDisplayName${i}" value="">
                <input type="hidden" class="form-control" name="InclusionDisplayName" id="InclusionDisplayID${i}" value="">
            </div>
            <div class="project-edit-lock-btn-box ml5">
                <a type="button" href="#" class="custom-edit-btn" data-toggle="modal" data-target="#inclusionlist${i}">
                    <i class="fa fa-plus"></i>
                </a>
            </div>
        </div>
    </td>
    <td>
        <div class="inner-field-flex-section">
            <div class="form-group custom-form-group mb0 w-100">
            <input type="text" class="form-control" name="InclusionDisplayName" id="ExclusionDisplayName${i}" value="">
            <input type="hidden" class="form-control" name="InclusionDisplayName" id="ExclusionDisplayID${i}" value="">
            </div>
            <div class="project-edit-lock-btn-box ml5">
                <a type="button" href="#" class="custom-edit-btn" data-toggle="modal" data-target="#exclusionlist${i}">
                    <i class="fa fa-plus"></i>
                </a>
            </div>
        </div>
    </td>
    <td>
        <div class="form-group custom-form-group mb0">
            <input type="date" class="form-control" name="" value="">
        </div>
    </td>
    <td>
        <div class="form-group custom-form-group mb0">
            <input type="date" class="form-control" name="" value="">
        </div>
    </td>
    <td>
        <div class="form-group custom-form-group mb0">
            <textarea class="form-control resize-none" rows="3" id="" placeholder="type here"></textarea>
        </div>
    </td>
    <td>
        <div class="reciprocal-action-btn-box">
            <a type="button" href="#" class="custom-edit-btn mr15" id="edit${i}">
                <i class="fa fa-pencil"></i>
            </a>
            <a type="button" href="#" class="custom-edit-btn" id="newrow${i}">
                <i class="fa fa-plus"></i>
            </a>
        </div>
    </td>
</tr>
<tbody>`
{
  this.modalHTMLInclusion +=`<div id="inclusionlist${i}" class="modal fade" role="dialog">
<div class="modal-dialog">

  <!-- Modal content-->
  <div class="modal-content reciprocal-custom-modal">
    <div class="modal-header">
       <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">&#10060;</span></button>
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

var arrayinclusion:any[] = [];
var arrayinclusionName:any[] = [];
$(`#inclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function() {
  arrayinclusionName.push($(this).closest("label").text())
  arrayinclusion.push($(this).val());
  
 

});
$(`#InclusionDisplayName${i}`).val(arrayinclusionName)
$(`#InclusionDisplayID${i}`).val(arrayinclusion)
            console.log(arrayinclusion,arrayinclusionName)
 });
}

{
  this.modalHTMLExclusion +=` <div id="exclusionlist${i}" class="modal fade" role="dialog">
<div class="modal-dialog">

  <!-- Modal content-->
  <div class="modal-content reciprocal-custom-modal">
    <div class="modal-header">
    <button type="button" class="close close-round" data-dismiss="modal"><span class="close-icon">&#10060;</span></button>  
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

  var arrayexclusion:any[] = [];
  var arrayexclusionName:any[] = [];
  $(`#exclusionID${i}`).find("div.checkbox").find("input:checkbox[name=type]:checked").each(function() {
    arrayexclusionName.push($(this).closest("label").text())
    arrayexclusion.push($(this).val());

$(`#ExclusionDisplayName${i}`).val(arrayexclusionName)
$(`#ExclusionDisplayID${i}`).val(arrayexclusion)
              });
              console.log(arrayexclusion,arrayexclusionName)
   })
  }



document.getElementById('data').innerHTML = this.table;
document.getElementById('modal-list-collection-inclusion').innerHTML = this.modalHTMLInclusion;
document.getElementById('modal-list-collection-exclusion').innerHTML = this.modalHTMLExclusion;
//$(`#inclusionID${i}`).html(InclusionMasterHTML);
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
