const initstate = {
  Usersessionid: {},
  UserData: {},
  SidebarToggle: false,
  ShowIconsOnly: false,
  DoctorListId: {},
  employeeIdget: {},
  UserListId: {},
  Usercreatedocdata: {},
  EmployeeListId: {}, //for employee user
  UsercreateEmpdata: {},
  ServiceProcedureMaster: {},
  ServiceProcedureRatecardView: {},
  InsClientDonationMaster: {},
  HrFolder: "",
  expendedcolor: '',
  showopenalert: false,
  ClinicDetails: {
    id: '',
    Cname: '',
    Clogo: null
  },
  toast: {
    message: '',
    type: ''
  },
  modelcon: {
    Isopen: false,
    content: null,
    type: 'image/jpg'
  },

  pagewidth: 0,
  UrlLink: 'http://127.0.0.1:8000/',
//  UrlLink: 'https://hims.vesoft.co.in/',
  // UrlLink: 'https://kg.vesoft.co.in/',
  // UrlLink: 'https://silverline.vesoft.co.in/',
  // UrlLink: 'https://chirayu.vesoft.co.in/',
  // UrlLink: 'https://trial.vesoft.co.in/',


  // websocketlink: 'wss://silverline.vesoft.co.in/ws/',
  Selected_Patient_Pharmacy: {},
  QRdata: {},
  activeCardName: null, 
  showMenu:false,
}

const Userdata = (state = initstate, action) => {
  switch (action.type) {
    case 'UserData':
      return { ...state, UserData: action.value }
    case 'Usersessionid':
      return { ...state, Usersessionid: action.value }

    case 'SidebarToggle': // Fixed typo here
      return { ...state, SidebarToggle: action.value }
    case 'employeeIdget':
      return { ...state, employeeIdget: action.value }
    case 'ShowIconsOnly':
      return { ...state, ShowIconsOnly: action.value }

    case 'ClinicDetails':
      return { ...state, ClinicDetails: action.value }

    case 'toast':
      return { ...state, toast: action.value }
    case 'modelcon':
      return { ...state, modelcon: action.value }

    case 'DoctorListId':
      return { ...state, DoctorListId: action.value }
    case 'UserListId':
      return { ...state, UserListId: action.value }
    case 'Usercreatedocdata':
      return { ...state, Usercreatedocdata: action.value }
    case 'EmployeeListId':
      return { ...state, EmployeeListId: action.value }

    case 'UsercreateEmpdata':
      return { ...state, UsercreateEmpdata: action.value }
    case 'pagewidth':
      return { ...state, pagewidth: action.value }

    case 'InsClientDonationMaster':
      return { ...state, InsClientDonationMaster: action.value }
    case 'ServiceProcedureMaster':
      return { ...state, ServiceProcedureMaster: action.value }
    case 'ServiceProcedureRatecardView':
      return { ...state, ServiceProcedureRatecardView: action.value }

    case 'Selected_Patient_Pharmacy':
      return { ...state, Selected_Patient_Pharmacy: action.value }

    case 'HrFolder':
      return { ...state, HrFolder: action.value }

    case 'QRdata':
      return { ...state, QRdata: action.value }
    case 'expendedcolor':
      return { ...state, expendedcolor: action.value }
    case 'showopenalert':
      return { ...state, showopenalert: action.value }

      case 'activeCardName': 
      localStorage.setItem('activeCardName', action.value);
      return { ...state, activeCardName: action.value }

      case "showMenu":
        return {
          ...state,
          showMenu: action.value,
   };


    default:
      return state
  }
}

export default Userdata
