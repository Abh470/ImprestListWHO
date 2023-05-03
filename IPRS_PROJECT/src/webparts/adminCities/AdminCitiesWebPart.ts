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
import * as strings from 'AdminCitiesWebPartStrings';

require("bootstrap");
require("../../webparts/CommonAssets/assets/css/padding.css");
require("../../webparts/CommonAssets/assets/css/styles.css");
require("../../webparts/CommonAssets/Style.css");
require("../../webparts/CommonAssets/Common.js");
const IprsLogo: any = require("../../webparts/CommonAssets/assets/images/IPRS-logo.png");

export interface IAdminCitiesWebPartProps {
  description: string;
}

export default class AdminCitiesWebPart extends BaseClientSideWebPart<IAdminCitiesWebPartProps> {

  protected onInit(): Promise<void> {
    sp.setup(this.context as any);
    return super.onInit();
  }

  public modalHtmlEdit=``;

  public async render(): Promise<void> {

    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    //SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js");
    SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js");


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
                    <h1 class="panel-head-text">Manage City</h1>
                </div>
                <div class="panel-body">
                        <div class="row mt25">
                        <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="form-group custom-form-group department-filter-box">
                            <label>Country:</label>
                            <select class="form-control select-assign" id="countrymaster">
                            </select>
                        </div>
                    </div>
                            <div class="col-md-2 col-sm-6 col-xs-12">
                                <div class="form-group custom-form-group">
                                    <label>City: <span class="text-red">*</span></label>
                                    <input type="text" class="form-control" name="" placeholder="Enter City" id="newcity">
                                </div>
                            </div>
                            <div class="col-md-1 col-sm-12 col-xs-12" id="add-button-box">
                                <div class="filter-button-area" data-toggle="modal" data-target="#alert-new-add">
                                    <button type="button" class="btn custom-btn mt25 tmt0 wpx-90">Add</button>
                                </div>
                            </div>
                            <div class="col-md-1 col-sm-12 col-xs-12" hidden id="edit-button-box">
                            <div class="filter-button-area" data-toggle="modal" data-target="#alert-edit">
                                    <button type="button" class="btn custom-btn mt25 tmt0 wpx-90">Edit</button>
                                </div>
                            </div>
                        </div>
                        <div class="row mt15">
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <div class="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                                    <table class="table mb0 custom-table">
                                        <thead>
                                            <tr>
                                                <th>Country</th>
                                                <th>City</th>
                                                <th class="w-1-th">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="citydata">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>

        <div id="alert-new-add" class="modal fade" role="dialog">
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


        <div id="alert-edit" class="modal fade" role="dialog">
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
         </div> `

    this.bindevent();
  }

  private async bindevent() {

    this.fetchfromCountryMaster();
    this.fetchfromCityMaster();
    this.domElement.querySelector('#add-data').addEventListener('click', () => {
      this.AddtoCityMaster();
    });

    

  }

  private async fetchfromCountryMaster(): Promise<void> {
    
    const items: any[] = await sp.web.lists.getByTitle("CountryMaster").items.get();
    console.log(items.length);

    let events = `<option value='' disabled selected >--Select--</option>`

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('countrymaster').innerHTML = events;
    ($('.select-assign')as any).select2({width: "100%"}); 
    
  }

  private async fetchfromCityMaster(): Promise<void> {
    const items: any[] = await sp.web.lists.getByTitle("CityMaster").items.select("Country/Title,*")
    .expand("Country").get();
    console.log(items);
    console.log(items.length);
    let table = ``;

    for (let i = 0; i < items.length; i++) {

      table += `
      <tr>
       <td>${items[i].Country.Title}</td>
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
      
      $(document).on('click', '#delete-data'+i ,async (): Promise<any>=>{
        var deleteid: any = items[i].ID
        var deletename: any= items[i].Title
        let answer = window.confirm(`Do you want to delete (${deletename}) ?`);
        
        if(answer == true){
          this.DeleteDatafromCityMaster(deleteid);
          location.reload();
        }

    });

    $(document).on('click', '#edit-data'+i ,async (): Promise<any>=>{
      var editid: any = items[i].ID
      var editname: any= items[i].Title
      var countryeditID: any= items[i].CountryId
      let answer = window.confirm(`Do you want to edit (${editname}) ?`);
      
      if(answer == true){
        $("#newcity").val(editname);
        //$("#countrymaster").val(countryeditID);
        $("#countrymaster").val(countryeditID).trigger('change');
        
        $("#add-button-box").hide();
        $("#edit-button-box").show();
        this.domElement.querySelector('#edit-data').addEventListener('click', () => { 
          this.EdittoCityMaster(editid);
        });
      }

  });


    }
    $("#citydata").html(table);

  }

  private async AddtoCityMaster(): Promise<void>{
    const NewCity: any = $("#newcity").val();
    const CountryID: any = $("#countrymaster").val();
    var error = null;
    console.log(NewCity)

    if (NewCity === "") {
      error = "Please Enter a City";
      alert(error);
  
    }
    
    else{
    sp.web.lists.getByTitle('CityMaster').items.add({

      Title:NewCity,
      CountryId:CountryID
    })

    .then(_response => {
      alert(`(${NewCity}) added to the List`)
      location.reload()
    })

    .catch(error => {
      alert(error);
    })
    
   }
  }

  private async EdittoCityMaster(numId:any) : Promise<void>{
    
    const NewCity: any = $("#newcity").val();
    const CountryID: any = $("#countrymaster").val();
    var error = null;
    console.log(NewCity)

    if (NewCity === "") {
      error = "Please Enter a City";
      alert(error);
  
    }
    
    else{
    sp.web.lists.getByTitle('CityMaster').items.getById(numId).update({

      Title:NewCity,
      CountryId:CountryID
    })

    .then(_response => {
      alert(`(${NewCity}) edited to the List`)
      location.reload()
    })

    .catch(error => {
      alert(error);
    })
    
   }

  }
  




  private async DeleteDatafromCityMaster(numId:any) : Promise<void>{
    
    let list = sp.web.lists.getByTitle("CityMaster");

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
