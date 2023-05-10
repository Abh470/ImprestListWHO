import * as React from 'react';
// import styles from './ManageInclusionReact.module.scss';
import { IManageInclusionReactProps } from './IManageInclusionReactProps';
import { sp } from "@pnp/sp/presets/all";
import { SPComponentLoader } from "@microsoft/sp-loader";
//import * as pnp from 'sp-pnp-js';
//import { sp, Web } from "@pnp/sp/presets/all"
import "jquery";

require("bootstrap");
require("../../CommonAssets/assets/css/padding.css");
require("../../CommonAssets/assets/css/styles.css");
require("../../CommonAssets/Style.css");
require("../../CommonAssets/Common.js");
require("../../CommonAssets/assets/css/jquery.multiselect.css");
require("../../CommonAssets/assets/js/jquery.multiselect.js");
const IprsLogo: any = require("../../CommonAssets/assets/images/IPRS-logo.png");

export interface State {
  InclusionMasteritems: sourceItem[];
  SelectedSource:any;
  Inclusion:string; 


}
export interface sourceItem {
  Source: [],
  Title: string,
  SourceId: [],
  ID: any
}

export default class ManageInclusionReact extends React.Component<IManageInclusionReactProps, State> {
  constructor(props: IManageInclusionReactProps, state: State) {
    super(props);
    sp.setup(props.context);
    this.state = {
      InclusionMasteritems: [],
      SelectedSource : "",
      Inclusion :""


    };
  }

  public CustomFieldGlobalName: any = "Others";

  public async componentDidMount(): Promise<any> {
    this.fetchfromInclusionMaster();
    await this.fetchfromSourceMaster();
    // this.domElement.querySelector('#add-data').addEventListener('click', () => {
    //   this.AddtoInclusionMaster();
    // });
  }

  public render(): React.ReactElement<IManageInclusionReactProps> {
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    //SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
    // SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js");


    return (
      <>
        <nav className="navbar navbar-custom header-nav">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#"><img src={IprsLogo} className="logo" alt="" /></a>
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
            </div>
          </div>
        </nav>


        <div className="container-fluid">
          <div className="custom-panel">
            <div className="panel-head">
              <h1 className="panel-head-text">Manage Inclusion</h1>
            </div>
            <div className="panel-body">
              <div className="row mt25">
                <div className="col-md-2 col-sm-6 col-xs-12">
                  <div className="form-group custom-form-group department-filter-box">
                    <label>Source: <span className="text-red">*</span></label>
                    <select id="SourceMaster" className="form-control" multiple={true} value={this.state.SelectedSource}>
                    </select>
                  </div>
                </div>
                <div className="col-md-2 col-sm-6 col-xs-12">
                  <div className="form-group custom-form-group">
                    <label>Inclusion: <span className="text-red">*</span></label>
                    <input type="text" className="form-control" name="" placeholder="Enter Inclusion" id="newInclsuion"  value={this.state.Inclusion}/>
                  </div>
                </div>
                <div className="col-md-1 col-sm-12 col-xs-12" id="add-button-box">
                  <div className="filter-button-area" data-toggle="modal" data-target="#alert-new-add">
                    <button type="button" className="btn custom-btn mt25 tmt0 wpx-90">Add</button>
                  </div>
                </div>
                <div className="col-md-1 col-sm-12 col-xs-12" hidden id="edit-button-box">
                  <div className="filter-button-area" data-toggle="modal" data-target="#alert-edit">
                    <button type="button" className="btn custom-btn mt25 tmt0 wpx-90">Edit</button>
                  </div>
                </div>
              </div>
              <div className="row mt15">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="table-responsive reciprocal-table skill-set-table scrollbar-panel">
                    <table className="table mb0 custom-table">
                      <thead>
                        <tr>
                          <th>Source</th>
                          <th>Inclusion</th>
                          <th className="w-1-th">Action</th>
                        </tr>
                      </thead>
                      <tbody id="inclusiondata">
                        {this.state.InclusionMasteritems.map((item, index) => {
                          return (
                            <tr>
                              <td>{item.Source.map((val: any) => {
                                return (val.Title)
                              })}</td>
                              <td>{item.Title}</td>
                              <td>
                                <div className="reciprocal-action-btn-box">
                                  <a type="button" href="#" className="custom-edit-btn mr15" id="edit-data${i}"
                                    onClick={() => {
                                      var editid: any = item.ID
                                      var editname: any = item.Title
                                      var sourceeditID: any = item.SourceId
                                      let answer = window.confirm(`Do you want to edit (${editname}) ?`);

                                      if (answer == true) {
                                        // $("#newInclsuion").val(editname);
                                        // $("#SourceMaster").val(sourceeditID);
                                        this.setState({Inclusion : editname});
                                        this.setState({SelectedSource : sourceeditID});
                                        ($('#SourceMaster') as any).multiselect('reload');


                                        $("#add-button-box").hide();
                                        $("#edit-button-box").show();
                                        // this.domElement.querySelector('#edit-data').addEventListener('click', () => {
                                        //   this.EdittoInclusionMaster(editid);
                                        // });
                                        $("#edit-data").click(() => this.EdittoInclusionMaster(editid))
                                      }
                                    }}
                                  >
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                  <a type="button" href="#" className="custom-edit-btn" id="delete-data${i}"
                                    onClick={async () => {
                                      var deleteid: any = item.ID
                                      var deletename: any = item.Title
                                      let answer = window.confirm(`Do you want to delete (${deletename}) ?`);

                                      if (answer == true) {
                                        await this.DeleteDatafromInclusionMaster(deleteid);
                                        location.reload();
                                      }
                                    }}>
                                    <i className="fa fa-trash"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt20 text-center">
                <a href={this.props.context.pageContext.web.absoluteUrl + "/SitePages/IPRSDashboard.aspx"} type="button"
                  className="btn custom-btn-two-cancel mr5 wpx-90">Close</a>
              </div>
            </div>
          </div>
        </div>




        <div id="alert-new-add" className="modal fade" role="dialog">
          <div className="modal-dialog">

            {/* <!-- Modal content--> */}
            <div className="modal-content reciprocal-custom-modal">
              <div className="modal-header">
                <button type="button" className="close close-round" data-dismiss="modal"><span className="close-icon">×</span></button>
                <h4 className="modal-title">Alert</h4>
              </div>
              <div className="modal-body">
                <p className="font-18">Are you sure you want to add new record?</p>
              </div>
              <div className="modal-footer">
                <button className="btn custom-btn mr-8" id="add-data"
                  onClick={
                    () => this.AddtoInclusionMaster()
                    }>Yes</button>
                <button className="btn custom-btn-two-cancel" data-dismiss="modal">No</button>
              </div>
            </div>

          </div>
        </div>

        <div id="alert-edit" className="modal fade" role="dialog">
          <div className="modal-dialog">

            {/* <!-- Modal content--> */}
            <div className="modal-content reciprocal-custom-modal">
              <div className="modal-header">
                <button type="button" className="close close-round" data-dismiss="modal"><span className="close-icon">×</span></button>
                <h4 className="modal-title">Alert</h4>
              </div>
              <div className="modal-body">
                <p className="font-18">Are you sure you want to edit this record?</p>
              </div>
              <div className="modal-footer">
                <button className="btn custom-btn mr-8" data-dismiss="modal" id="edit-data"
                >Yes</button>
                <button className="btn custom-btn-two-cancel" data-dismiss="modal">No</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  private async fetchfromInclusionMaster(): Promise<void> {

    const items: sourceItem[] = await sp.web.lists.getByTitle("InclusionMaster").items.filter(`Title ne '${this.CustomFieldGlobalName}'`)
      .select("*,Source/Title").expand("Source").get();
    console.log(items);

    this.setState({ InclusionMasteritems: items });


    //     let table = ``

    //     for (let i = 0; i < items.length; i++) {
    //       table += `
    // <tr>
    // <td>${items[i].Source.map((val: any) => {
    //         return (val.Title)
    //       })}</td>
    // <td>${items[i].Title}</td>
    // <td>
    //     <div class="reciprocal-action-btn-box">
    //         <a type="button" href="#" class="custom-edit-btn mr15" id="edit-data${i}">
    //             <i class="fa fa-pencil"></i>
    //         </a>
    //         <a type="button" href="#" class="custom-edit-btn" id="delete-data${i}">
    //                 <i class="fa fa-trash"></i>
    //         </a>
    //     </div>
    // </td>
    // </tr>`


    // $(document).on('click', '#delete-data' + i, async (): Promise<any> => {
    //   var deleteid: any = items[i].ID
    //   var deletename: any = items[i].Title
    //   let answer = window.confirm(`Do you want to delete (${deletename}) ?`);

    //   if (answer == true) {
    //     await this.DeleteDatafromInclusionMaster(deleteid);
    //     location.reload();
    //   }

    // });

    //   $(document).on('click', '#edit-data' + i, async (): Promise<any> => {
    //     var editid: any = items[i].ID
    //     var editname: any = items[i].Title
    //     var sourceeditID: any = items[i].SourceId
    //     let answer = window.confirm(`Do you want to edit (${editname}) ?`);

    //     if (answer == true) {
    //       $("#newInclsuion").val(editname);
    //       $("#SourceMaster").val(sourceeditID);
    //       ($('#SourceMaster') as any).multiselect('reload');


    //       $("#add-button-box").hide();
    //       $("#edit-button-box").show();
    //       // this.domElement.querySelector('#edit-data').addEventListener('click', () => {
    //       //   this.EdittoInclusionMaster(editid);
    //       // });
    //     }

    //   });



    // }
    // $("#inclusiondata").html(table);

  }

  private async fetchfromSourceMaster(): Promise<void> {

    const items: any[] = await sp.web.lists.getByTitle("SourceMaster").items.get();
    console.log(items.length);

    let events = ``

    for (let i = 0; i < items.length; i++) {

      events += `<option value='${items[i].ID}'> ${items[i].Title} </option>`
      console.log(items[i].Title)

    }

    document.getElementById('SourceMaster').innerHTML = events;
    ($('#SourceMaster') as any).multiselect({
      columns: 1,
      selectAllText: false,
      placeholder: 'Select Your Options',
      search: true,
      searchOptions: {
        'default': 'Search'
      },
      selectAll: true,
    });

  }


  private async AddtoInclusionMaster(): Promise<void> {

    const NewInclusion: any = $("#newInclsuion").val();
    const SourceID: any = $("#SourceMaster").val();
    var error = null;
    console.log(NewInclusion)

    if (NewInclusion === "") {
      error = "Please Enter an Inclusion";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('InclusionMaster').items.add({

        Title: NewInclusion,
        SourceId: { results: SourceID }
      })

        .then(_response => {
          alert(`(${NewInclusion}) added to the List`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }
  }


  private async EdittoInclusionMaster(numId: any): Promise<void> {

    const NewInclusion: any = $("#newInclsuion").val();
    const SourceID: any = $("#SourceMaster").val();
    var error = null;
    console.log(NewInclusion)

    if (NewInclusion === "") {
      error = "Please Enter an Inclusion";
      alert(error);

    }

    else {
      sp.web.lists.getByTitle('InclusionMaster').items.getById(numId).update({

        Title: NewInclusion,
        SourceId: { results: SourceID }
      })

        .then(_response => {
          alert(`(${NewInclusion}) edited to the List`)
          location.reload()
        })

        .catch(error => {
          alert(error);
        })

    }

  }


  private async DeleteDatafromInclusionMaster(numId: any): Promise<void> {

    let list = await sp.web.lists.getByTitle("InclusionMaster").items.getById(numId).delete();
    console.log(list)

  }
}






