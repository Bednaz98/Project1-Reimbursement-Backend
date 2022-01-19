import cors from "cors";
import express from "express";
import { parseJsonText } from "typescript";
import DAOWrapper from "./DAOClasses/DAOWrapper";
import DataProcessor from "./Project1-GitUtil-Reimbursement/Classes/DataProcessor";
import { Profile, Request } from "./Project1-GitUtil-Reimbursement/Types/Entity";
import { HTTPRequestErrorFlag, RequestStatus } from "./Project1-GitUtil-Reimbursement/Types/Enums";
import AdminService from "./Services/AdminService";
import DAOCheckManager from "./Services/DAOCheckService";
import EncryptionSys from "./Services/EncryptService";
import LoginService from "./Services/LogingService";
import ProfileService from "./Services/ProfileService";
import RequestService from "./Services/RequestService";
import Logger from "./Services/ServerLogger";
import {ResultReturnMarkRequest, ResultReturnStringID, TransferRequest, TransferRequestArray} from './Project1-GitUtil-Reimbursement/Types/dto';


// Class Initilizaers=========================
// Server Init
const app = express(); // Server Init


//Server Options================================
// Converts body to json Automatically
app.use(express.json()); // Auto convert all incoming request to json
app.use(cors()); // enable cors
const PortNumber:number = 3001;

//==============================================
// Logging service
const DebugLog:Logger = new Logger (0)

//Services ======================
// DAO
const DAOClass:DAOWrapper  = new DAOWrapper (1,DebugLog);


DebugLog.print(' NEW SESSION ########################################################')
app.listen(PortNumber,  ()=> {
    console.log(`+++++++++++++ Server Started ++++++++++++++++ \n Starting on >>>>>  localhost:${PortNumber} `); 
    DebugLog.print(' NEW SESSION ########################################################');
});
// low level level services
const Proc:DataProcessor = new DataProcessor();
const DAOCheck:DAOCheckManager = new DAOCheckManager(DAOClass,DebugLog,Proc);
const Encrypt:EncryptionSys = new EncryptionSys();

// higher level services
const PS:ProfileService = new ProfileService(DAOClass,Proc,DAOCheck,DebugLog );
const RS:RequestService = new RequestService(DAOClass, Proc, DAOCheck,DebugLog);
const AS:AdminService = new AdminService(DAOClass, DAOCheck);
const LS:LoginService = new LoginService(DAOClass)

app.get('/Connect', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    res.status(200)
    await DebugLog.print('Connection Hit',0)
    res.send(JSON.stringify('Connected'));
})

app.post('/Login/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {password} = req.body
    await  DebugLog.print(`Login requested [${ID}]`,0)
    const LoginReturn = await LS.Login(ID,password)
    if(LoginReturn.ReturnProfile){
        res.status(200)
    }
    else{res.status(401)}
    await DebugLog.print(`Login success  [${JSON.stringify( LoginReturn )}]`,0)
    res.send(JSON.stringify( LoginReturn ));
})

app.patch('/LogOut/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    await  DebugLog.print(`Logout requested: [${ID}]`,0)
    const {authentication}=req.body;
    const ReturnResult = await LS.LogOut(ID,authentication)
    await  DebugLog.print(`Logout result: [${ JSON.stringify(ReturnResult) }]`,0)
    res.status(200)
    res.send(JSON.stringify(ReturnResult));
})



// PROFILE ROUTES ######################################################
// CreateProfile(ProfileInit:HTTPCreateProfile):Promise<Profile>
app.post('/Create', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    await  DebugLog.print('HTTP Create Profile',0)
    const {FirstName,LastName, Password, id}=req.body;
    try {
        await DebugLog.print('Create Try block',0)
        //create
        const ReturnLogin = await PS.CreateProfile( {FirstName,LastName, Password, id});
        const ReturnAuthentication = await LS.CreateCreds(ReturnLogin .ReturnProfile.id);
        ReturnLogin.AuthenticationString = ReturnAuthentication
        await DebugLog.print(`Return Profile: [${JSON.stringify( ReturnLogin  )}]`,0)
        res.status(200);
        res.send(JSON.stringify( ReturnLogin ));
    } catch (error) {
        switch(error?.errorType){
            case HTTPRequestErrorFlag.NameCharError:{ res.status(400);DebugLog.print('Rejected creation: Name too short') }
            default: { res.status(500); DebugLog.print('Rejected creation: Unknown Server Error')}
        }
        res.send( JSON.stringify( error ) );
    }
})
// ChangeFirstName(EmployeeID:string, NewFirstName:string):Promise<string>
app.patch('/Profile/:ID/ChangeFirst', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {authentication, NewFirstName } = req.body;
    await  DebugLog.print(`First name change requested [${ID}] => [${NewFirstName}]`,0)
    try {
        const ResultReturnString =await PS.ChangeFirstName(ID,NewFirstName)
        await DebugLog.print(`Return First Name: [${JSON.stringify( ResultReturnString ) }]`,0)
        res.status(200)
        res.send(JSON.stringify( ResultReturnString ));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404); DebugLog.print(`Change First name Rejected`,0)}
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// ChangeLastName(EmployeeID:string, NewLastName:string):Promise<string>
app.patch('/Profile/:ID/ChangeLast', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {authentication, NewLastName }=req.body;
    await  DebugLog.print(`Last name change requested: [${ID}] => [${NewLastName}]`,0)
    try {
        const ResultReturnString = await PS.ChangeLastName(ID,NewLastName )
        res.status(200)
        await DebugLog.print(`Last name return: [JSON.stringify( ResultReturnString )]`,0)
        res.send(JSON.stringify( ResultReturnString ));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404); DebugLog.print(`Reject Last Name change`,0) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// ChangePassword(EmployeeID:string, NewPassword:string):Promise<string>
app.patch('/Profile/:ID/ChangePassword', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {authenticationString, NewPassword }=req.body;
    await  DebugLog.print(`Password change requested [${ID}] => [${ NewPassword}]`,0)
    try {
        const ResultReturnString = await PS.ChangePassword(ID,NewPassword  )
        res.status(200)
        res.send(JSON.stringify({...ResultReturnString}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// GetManagerName(ManagerID:string):Promise<string> ###################################################
app.get('/Profile/:ID/Manager', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {authenticationString, ManagerID}= req.body;
    await  DebugLog.print(`Manager name Requested [${ID}] => [${ ManagerID}]`,0)
    try {
        const ResultReturnString = await PS.GetManagerName(ManagerID)
        res.status(200)
        await  DebugLog.print(`Manager Name Sent: [${ResultReturnString.ReturnString}]`,0)
        res.send(JSON.stringify( ResultReturnString ));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// MakeRequest(EmployeeID:string, Amount:number, file:any):Promise<Request>
app.post('/Request/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {AuthenticationString, Amount, file }=req.body;
    await  DebugLog.print(`Request Request creation [${ID}] => [${Amount}]`,0)
    try {
        const ReturnRequestArray = await PS.MakeRequest(ID,Amount,file)
        res.status(200)
        await  DebugLog.print(`Created Request Sent [${ID}] => [${ReturnRequestArray.ReturnRequest.id}]`,0)
        res.send(JSON.stringify({...ReturnRequestArray}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// DeleteRequest(EmployeeID:string, RequestID:string):Promise<boolean>
app.delete('/Request/:ID/:AuthorizationString/:RequestID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID, AuthorizationString,RequestID} = req.params;
    await  DebugLog.print(`Requested Delete Request [${ID}] => [${RequestID}]`,0)
    try {
        const ReturnResult= await PS.DeleteRequest(ID, RequestID)
        res.status(200)
        await  DebugLog.print(`Delete Request return string [${ID}] => [${ReturnResult.ResultCheck}]`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(401) }
            default: { res.status(408) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// GetAllSentRequestOfType(IDstring:string, Type:RequestStatus):Promise<Request[]>
app.get('/Request/:ID/:AuthorizationString/:Type', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID, AuthorizationString} = req.params;
    const Type:number = parseInt(req.params.Type);
    await  DebugLog.print(`HTTP Request search[${ID}] => type (number): [${Type}]`,0)
    try {
        let ReturnRequestArray:TransferRequestArray;
        switch(Type){
            case 0:     {await  DebugLog.print(`Try Request search [${ID}] => type (number): [${Type}]`,0); ReturnRequestArray = await PS.GetAllSentRequestOfType(ID,0); }
            case 1:     {await  DebugLog.print(`Try Request search [${ID}] => type (number): [${Type}]`,0); ReturnRequestArray = await PS.GetAllSentRequestOfType(ID,1);}
            case 2:     {await  DebugLog.print(`Try Request search [${ID}] => type (number): [${Type}]`,0);  ReturnRequestArray = await PS.GetAllSentRequestOfType(ID,2);}
            case 3:     {await  DebugLog.print(`Try Request search [${ID}] => type (number): [${Type}]`,0);  ReturnRequestArray = await PS.GetAllSentRequestOfType(ID,3 );}
            default:    {await  DebugLog.print(`Try Request search [${ID}] => type (number): [${Type}]`,0);  ReturnRequestArray = await PS.GetAllSentRequestOfType(ID,4 );}
        }
        res.status(200);
        await  DebugLog.print(`Request search [${ID}] => sent ${ReturnRequestArray.ReturnRequestArray.length}`,0)
        res.send(JSON.stringify(ReturnRequestArray));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})

//Manager Routes #######################################################
//ManagerChangeRequest(ManagerID:string, RequestID:string,Type:RequestStatus ):Promise<Request>
app.patch('/Manager/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const BodyReturn:ResultReturnMarkRequest = req.body
    await  DebugLog.print(`HTTP Manager change Request [${ID}] => Type:[${RequestStatus[BodyReturn.Type]}] >> [${BodyReturn.ReturnString}]`,0);
    try {
        await  DebugLog.print(`Manager change > [${BodyReturn.Type}]`,0);
        const ReturnRequestArray:TransferRequest =  await RS.ManagerChangeRequest(ID,BodyReturn.ReturnString,BodyReturn.Type, BodyReturn.Message)
        res.status(200)
        await  DebugLog.print(`Manager request change sent [${ID}] => type:[${RequestStatus[ReturnRequestArray.ReturnRequest.RequestStatus]}] >> [${ReturnRequestArray.ReturnRequest.id}]`,0)
        res.send(JSON.stringify({...ReturnRequestArray}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// manager request search
app.get('/Manager/:ID/:AuthorizationString', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID,AuthorizationString} = req.params;
    await  DebugLog.print(`HTTP Manager getting all request [${ID}] `,0)
    try {
        const ReturnRequestArray = await RS.ManagerGetAllRequest(ID)
        res.status(200)
        await  DebugLog.print(`Manager search sent [${ID}]`,0)
        res.send(JSON.stringify({...ReturnRequestArray}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})

// Admin Routes ########################################################
// AdminGetAllEmployees():Promise<Profile[]>
app.get('/Admin/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication }=req.body;
    await  DebugLog.print(`Admin Request All employees ${ID}`,0)
    try {
        const ReturnProfileArray = await AS.AdminGetAllEmployees()
        res.status(200)
        await  DebugLog.print(`Admin profile search sent [${ID}]]`,0)
        res.send(JSON.stringify({...ReturnProfileArray}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// AdminAssignManager(EmployeeID:string, ManagerID:string):Promise<boolean>
app.patch('/Admin/:ID/Assign', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication, EmployeeID, ManagerID }=req.body;
    await  DebugLog.print(`Admin Request assignments ${ID} => ${EmployeeID} >> ${ManagerID}`,0)
    try {
        const ReturnResult = await AS.AdminAssignManager(EmployeeID, ManagerID)
        res.status(200)
        await  DebugLog.print(`Admin Assignment return sent`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
// AdminRemoveEmployeeAssignment(EmployeeID:string, ManagerID:string, AdminID:string):Promise<boolean>
app.patch('/Admin/:ID/UnAssign', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication, EmployeeID, ManagerID }=req.body;
    await  DebugLog.print(`Admin Request Un-assignment ${ID} => ${EmployeeID} >> ${ManagerID}`,0)
    try {
        const ReturnResult = await AS.AdminRemoveEmployeeAssignment(EmployeeID, ManagerID, ID)
        res.status(200)
        await  DebugLog.print(`Admin un-assignment return sent`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
//AdminDeleteProfile(EmployeeID: string): Promise<boolean>
app.delete('/Admin/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication, EmployeeID }=req.body;
    await  DebugLog.print(`Admin request delete profile ${ID} => ${EmployeeID}`,0)
    try {
        const ReturnResult = await AS.AdminDeleteProfile(EmployeeID)
        res.status(200)
        await  DebugLog.print(`Admin delete profile return sent`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        switch(error?.errorType){
            case /*HTTPRequestErrorFlag*/0:{ res.status(404) }
            default: { res.status(404) }
        }
        res.send( JSON.stringify( error ) );
    }
})
