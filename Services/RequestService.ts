import DAOWrapper from "../DAOClasses/DAOWrapper";
import DataProcessor from "../Project1-GitUtil-Reimbursement/Classes/DataProcessor";
import ThrowServerError from "../Project1-GitUtil-Reimbursement/Classes/ServerErrorClass";
import { TransferRequest, TransferRequestArray } from "../Project1-GitUtil-Reimbursement/Types/dto";
import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import { HTTPRequestErrorFlag, RequestStatus } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import { ManagerHTTPCLInterface } from "../Project1-GitUtil-Reimbursement/Types/HTTPCommands";
import DAOCheckManager from "./DAOCheckService";
import Logger from "./ServerLogger";


export default class RequestServices implements ManagerHTTPCLInterface{
    private DAOClass: DAOWrapper;
    private Proc:DataProcessor;
    private Checker:DAOCheckManager;
    private DebugLog:Logger;
    constructor(InitDAO:DAOWrapper, InitDataProcessor:DataProcessor,InitDAOCheck:DAOCheckManager, InitDebugLog:Logger ){
        this.DAOClass=InitDAO;
        this.Proc=InitDataProcessor
        this.Checker=InitDAOCheck
        this.DebugLog = InitDebugLog
    }

    async ManagerChangeRequest(ManagerID:string, RequestID:string,Type:RequestStatus,Message:string  ):Promise<TransferRequest> {
        this.DebugLog.print('Service Mark Request called',0)
        // tries to check the DAO for this manager
        const FoundManager:Profile = await this.DAOClass.GetSingleProfile(ManagerID)
        // returns an error if not found
        //if(! FoundManager){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral) }
        // checks to see if they have any manager privileges
        //if(! this.Checker.IsManger(FoundManager) ){ ThrowServerError(HTTPRequestErrorFlag.NotAManager) }
        // checks to see if this manager has permissions to access this request
        const HasPermission:boolean = (this.Proc.ExtractRequestIDs(RequestID)).includes(FoundManager.id);
        //if(!HasPermission){ ThrowServerError(HTTPRequestErrorFlag.ManagerNotValidPrivileges) }
        // Checks to see if the manager is using invalid marking status
        //if(Type == RequestStatus.deleted){ ThrowServerError(HTTPRequestErrorFlag.RequestManagerDeleteError) }
        //if(Type == RequestStatus.All){ ThrowServerError(HTTPRequestErrorFlag.RequestManagerInvalidType) }
        // tries to find the request
        const FoundRequest:Request = await this.DAOClass.GetSingleRequest(RequestID);
        FoundRequest.ManagerMessage=Message;
        //if(!FoundRequest){ ThrowServerError(HTTPRequestErrorFlag.RequestNotFound) }
        // report an error if the request was already changed from pending
        //if(FoundRequest.RequestStatus !== RequestStatus.Pending){ ThrowServerError(HTTPRequestErrorFlag.RequestChangeStatusError) }
        //Mark and update request
        FoundRequest.RequestStatus = Type;
        const IntermediateRequest:Request = await this.DAOClass.UpdateRequest(FoundRequest);
        //Mark Request
        IntermediateRequest.RequestStatus = Type;
        //Update Modified time
        IntermediateRequest.ModifiedDate = Date.now() ;
        //write request to the DAO
        const ReturnRequest:Request = await this.DAOClass.UpdateRequest(IntermediateRequest);
        //if(!ReturnRequest){ ThrowServerError(HTTPRequestErrorFlag.RequestUpdateError) }
        // finally returns the request that is updated
        this.DebugLog.print('Service returning request changed',0)
        return {ReturnRequest:ReturnRequest};
    }
    async ManagerGetAllRequest(ManagerID:string):Promise<TransferRequestArray>{
        this.DebugLog.print('Service Get All Manager request called',0)
        const FoundArray:Request[] = await this.DAOClass.GetAllRequest()
        let ReturnArray:Request[] = [];
        for(let i =0; i <FoundArray.length ; i++ ){
            this.Proc.ExtractRequestIDs(FoundArray[i].id)
            if(this.Proc.ExtractRequestIDs(FoundArray[i].id).includes(ManagerID)){
                ReturnArray.push(FoundArray[i])
            }
        }
        const Transfer:TransferRequestArray = {ReturnRequestArray:ReturnArray }
        this.DebugLog.print(`Service Get All Manager request return, Total: ${Transfer.ReturnRequestArray.length}`,0);
        return Transfer;
    }

}