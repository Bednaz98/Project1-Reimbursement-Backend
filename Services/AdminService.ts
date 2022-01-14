import LocalDAO from "../DAOClasses/LocalDAO";
import ThrowServerError from "../Project1-GitUtil-Reimbursement/Classes/ServerErrorClass";
import { ResultReturnCheck, TransferProfileArray } from "../Project1-GitUtil-Reimbursement/Types/dto";
import { Profile } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import { HTTPRequestErrorFlag } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import { AdminHTTPCLInterface } from "../Project1-GitUtil-Reimbursement/Types/HTTPCommands";
import DAOCheckManager from "./DAOCheckService";


export default class AdminService implements AdminHTTPCLInterface{
    private DAOclass:LocalDAO;
    private Checker:DAOCheckManager;
    constructor(InitDAO, InitDAOCheckManager:DAOCheckManager){
        this.DAOclass = InitDAO;
        this.Checker= InitDAOCheckManager
    }

    // returns all employees in the DAO
    async AdminGetAllEmployees():Promise<TransferProfileArray> {
        return { ReturnProfileArray:(await this.DAOclass.GetAllProfiles())}
    }

    async AdminAssignManager(EmployeeID:string, ManagerID:string):Promise<ResultReturnCheck> {
        // checks if the employee is found
        const Employee:Profile = await this.DAOclass.GetSingleProfile(EmployeeID)
        //if(!Employee) { ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral) }
        //check if the manager is found
        const Manager:Profile = await this.DAOclass.GetSingleProfile(ManagerID)
        //if(!Manager){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral)  }
        // Assign adds
        Employee.ManagerID = Manager.id
        Manager.EmployeeArray.push( Employee.id)
        // update the employee on the DAO
        const ReturnEmployee:Profile = await this.DAOclass.UpdateProfile(Employee)
       // if(!ReturnEmployee){ ThrowServerError(HTTPRequestErrorFlag.EmployeeAssignmentError) }
        // update manager on the DAO
        const ReturnManager:Profile = await this.DAOclass.UpdateProfile(Manager)
        //if(!ReturnManager){ ThrowServerError(HTTPRequestErrorFlag.ManagerAssignmentError) }
        // should return when both return true
        return { ResultCheck:( (ReturnManager !== undefined) && (ReturnEmployee !== undefined) )};
    }

    async AdminRemoveEmployeeAssignment(EmployeeID:string, ManagerID:string, AdminID:string):Promise<ResultReturnCheck> {
        // checks if the employee is found
        const Employee:Profile = await this.DAOclass.GetSingleProfile(EmployeeID)
        //if(!Employee) { ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral) }
        //check if the manager is found
        const Manager:Profile = await this.DAOclass.GetSingleProfile(ManagerID)
        //if(!Manager){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral)  }
        //check if the manager is found
        const Admin:Profile = await this.DAOclass.GetSingleProfile( AdminID)
        //if(!AdminID){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral)  }
        // Assign adds assign employee to the admin, admin should change this right after
        Employee.ManagerID = Admin.id
        // find the employee if the manager array and remove
        const Index:number = Manager.EmployeeArray.indexOf(EmployeeID)
        Manager.EmployeeArray.splice( Index,Index)
        // update the employee on the DAO
        const ReturnEmployee:Profile = await this.DAOclass.UpdateProfile(Employee)
        //if(!ReturnEmployee){ ThrowServerError(HTTPRequestErrorFlag.EmployeeAssignmentError) }
        // update manager on the DAO
        const ReturnManager:Profile = await this.DAOclass.UpdateProfile(Manager)
        //if(!ReturnManager){ ThrowServerError(HTTPRequestErrorFlag.ManagerAssignmentError) }
        // should return when both return true
        return { ResultCheck:( (ReturnManager ) && (ReturnEmployee ) && (Admin !== undefined)) };
    }
    
    async AdminDeleteProfile(EmployeeID:string):Promise<ResultReturnCheck> {
        throw new Error("Method not implemented.");
    }

}