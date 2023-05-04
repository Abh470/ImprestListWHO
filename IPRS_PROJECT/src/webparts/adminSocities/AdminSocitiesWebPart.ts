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
import * as strings from 'AdminSocitiesWebPartStrings';


require("bootstrap");
require("../../webparts/CommonAssets/assets/css/padding.css");
require("../../webparts/CommonAssets/assets/css/styles.css");
require("../../webparts/CommonAssets/Style.css");
require("../../webparts/CommonAssets/Common.js");
const IprsLogo: any = require("../../webparts/CommonAssets/assets/images/IPRS-logo.png");

export interface IAdminSocitiesWebPartProps {
  description: string;
}

export default class AdminSocitiesWebPart extends BaseClientSideWebPart<IAdminSocitiesWebPartProps> {

  protected onInit(): Promise<void> {
    sp.setup(this.context as any);
    return super.onInit();
  }

  public async render(): Promise<void> {


    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css");
    SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");



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
            <h1 class="panel-head-text">Manage Society</h1>
        </div>
        <div class="panel-body">
            <div class="row mt25">
                <div class="col-md-2 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group department-filter-box">
                        <label>Country:</label>
                        <select class="form-control select-assign" id="countrymaster">
                        </select>
                    </div>
                </div>
                <div class="col-md-2 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group department-filter-box">
                        <label>City:</label>
                        <select class="form-control select-assign" id="citymaster">
                        </select>
                    </div>
                </div>
                <div class="col-md-2 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Society: <span class="text-red">*</span></label>
                        <input type="text" class="form-control" name="" placeholder="Enter Society" id="newSociety">
                    </div>
                </div>
                <div class="col-md-2 col-sm-6 col-xs-12">
                    <div class="form-group custom-form-group">
                        <label>Society Code: <span class="text-red">*</span></label>
                        <input type="text" class="form-control" name="" placeholder="Enter Society Code" id="newSocietyCode">
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
                                    <th>Society Code</th>
                                    <th>Society</th>
                                    <th>Country</th>
                                    <th>City</th>
                                    <th class="w-1-th">Action</th>
                                </tr>
                            </thead>
                            <tbody id="societydata">
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
                <button type="button" class="close close-round" data-dismiss="modal"><span
                        class="close-icon">×</span></button>
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
                <button type="button" class="close close-round" data-dismiss="modal"><span
                        class="close-icon">×</span></button>
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
</div>
        `

    this.bindevent();

  }

  private bindevent() {

    this.fetchfromCountryMaster();
    this.fetchfromSocietyMaster();
    this.forselectedoptionCountry();
    this.domElement.querySelector('#add-data').addEventListener('click', () => {
      this.AddtoSocietyMaster();
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
    ($('.select-assign') as any).select2({ width: "100%" });

  }
  // onchange of country fetch country start

  private forselectedoptionCountry() {
    var scope = this
    $("#countrymaster").on("change", function () {

      var selectedCountry = $("#countrymaster").val()

      console.log(selectedCountry)

      scope.fetchfromCityMaster(selectedCountry);
    });
  }
  // onchange of country fetch country end




  private async fetchfromCityMaster(CountryId: any): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("CityMaster").items.filter(`Country eq ${CountryId}`).get();
    console.log(items.length);

    let events = `<option value='' disabled selected >--Select--</option>`

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('citymaster').innerHTML = events;
    ($('.select-assign') as any).select2({ width: "100%" });

  }



  private async fetchfromSocietyMaster(): Promise<void> {
    const items: any[] = await sp.web.lists.getByTitle("SocietyMaster").items
      .select("*,Country/Title,City/Title")
      .expand("Country,City").get();
    console.log(items.length)

    let table = ``

    for (let i = 0; i < items.length; i++) {

      table += `
      <tr>
      <td>${items[i].Code}</td>
      <td>${items[i].Title}</td>
      <td>${items[i].Country.Title}</td>
      <td>${items[i].City.Title}</td>
      <td>
          <div class="reciprocal-action-btn-box">
              <a type="button" href="#" class="custom-edit-btn mr15" id="edit-data${i}">
                  <i class="fa fa-pencil"></i>
              </a>
              <a type="button" href="#" class="custom-edit-btn" id="delete${i}">
                      <i class="fa fa-trash"></i>
              </a>
          </div>
      </td>
  </tr>`

      $(document).on('click', `delete` + i, async (): Promise<any> => {
        var deleteid: any = items[i].ID
        var deletename: any = items[i].Title
        let answer = window.confirm(`Do you want to delete (${deletename}) ?`);

        if (answer == true) {
         await this.DeleteDatafromSocietyMaster(deleteid);
          location.reload();
        }
      });

      $(document).on('click', '#edit-data'+i ,async (): Promise<any>=>{
        var editid: any = items[i].ID
        var editname: any= items[i].Title
        var editcode: any= items[i].Code
        var countryeditID: any= items[i].CountryId
        var cityeditID: any= items[i].CityId
        let answer = window.confirm(`Do you want to edit (${editname}) ?`);
        
        if(answer == true){
          $("#newSociety").val(editname);
          $("#newSocietyCode").val(editcode);
          $("#countrymaster").val(countryeditID).trigger('change');
          setTimeout(() => {
            $("#citymaster").val(cityeditID).trigger('change');
          }, 190);
          
          
          $("#add-button-box").hide();
          $("#edit-button-box").show();
          this.domElement.querySelector('#edit-data').addEventListener('click', () => { 
            this.EdittoSocietyMaster(editid);
          });
        }
  
    });

    }
    $("#societydata").html(table)
  }


  private async AddtoSocietyMaster(): Promise<void> {
    const NewSociety: any = $("#newSociety").val();
    const NewSocietyCode: any = $("#newSocietyCode").val();
    const CountryID: any = $("#countrymaster").val();
    const CityID: any = $("#citymaster").val();
    var error = null;
    console.log(NewSociety)

    if (NewSociety === "") {
      error = "Please Enter a Society";
      alert(error);

    }
    else if (NewSocietyCode === "") {
      error = "Please Enter the Society Code";
      alert(error);
    }

    else {
      sp.web.lists.getByTitle('SocietyMaster').items.add({

        Title: NewSociety,
        Code: NewSocietyCode,
        CountryId: CountryID,
        CityId: CityID
      })

        .then(_response => {
          alert(`(${NewSociety}) and (${NewSocietyCode}) added to the List`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }
  }


  private async EdittoSocietyMaster(numId: any): Promise<void> {
    const NewSociety: any = $("#newSociety").val();
    const NewSocietyCode: any = $("#newSocietyCode").val();
    const CountryID: any = $("#countrymaster").val();
    const CityID: any = $("#citymaster").val();
    var error = null;
    console.log(NewSociety)

    if (NewSociety === "") {
      error = "Please Enter a Society";
      alert(error);

    }
    else if (NewSocietyCode === "") {
      error = "Please Enter the Society Code";
      alert(error);
    }

    else {
      sp.web.lists.getByTitle('SocietyMaster').items.getById(numId).update({

        Title: NewSociety,
        Code: NewSocietyCode,
        CountryId: CountryID,
        CityId: CityID
      })

        .then(_response => {
          alert(`(${NewSociety}) and (${NewSocietyCode}) added to the List`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }
  }



  private async DeleteDatafromSocietyMaster(numId: any): Promise<void> {

    let list = await sp.web.lists.getByTitle("SocietyMaster").items.getById(numId).delete();

    
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
