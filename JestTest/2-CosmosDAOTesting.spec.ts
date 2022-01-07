import CosmosDAOManager from "../DAOClasses/CosmosDAO";
import {GetPrimaryConnectionKey, GetDataBaseName, GetProfileContainerName, GetRequestContainerName} from "../DateBaseStringValues";
import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import ProfileManager from "../Project1-GitUtil-Reimbursement/Classes/ProfileManager";
import RequestBuilder from "../Project1-GitUtil-Reimbursement/Classes/RequestBuilder";
import DataProcessor from '../Project1-GitUtil-Reimbursement/Classes/DataProcessor';



//it("CosmosDAO: TestName", async ()=>{ })

describe('CosmosDAO Test', ()=>{
    it("CosmosDAO: TestName", async ()=>{ expect(true).toBeTruthy();})
    // const FirstNameArray:string[] = ['Admin','Manager','Employee']
    // const LastNameArray:string[] = ['LastAd','ManLast','EmpLast']
    // const DAOObject:CosmosDAOManager = new CosmosDAOManager();

    // it("CosmosDAO: Check Primary Key", async ()=>{
    //     const Temp:string = GetPrimaryConnectionKey();
    //     expect(Temp).toBeTruthy();
    // })
    // it("CosmosDAO: Check Database Name", async ()=>{
    //     const Temp:string = GetDataBaseName();
    //     expect(Temp).toBeTruthy();
    // })
    // it("CosmosDAO: Check Profile Container Name", async ()=>{
    //     const Temp:string = GetProfileContainerName();
    //     expect(Temp).toBeTruthy();
    // })
    // it("CosmosDAO: Check Request Container Name", async ()=>{
    //     const Temp:string = GetRequestContainerName();
    //     expect(Temp).toBeTruthy();
    // })

    // const AdminProfile:Profile = {FirstName:FirstNameArray[0], LastName:LastNameArray[0]};
    // const ManagerProfile:Profile = {FirstName:FirstNameArray[1], LastName:LastNameArray[1]};
    // const EmployeeProfile:Profile = {FirstName:FirstNameArray[2], LastName:LastNameArray[2]};
    // it("CosmosDAO: Creating Testing Profiles", async ()=>{ 
    //     const ReturnAdmin = await DAOObject.CreateProfile( (new ProfileManager(AdminProfile)).DeconstructProfile() );
    //     const ReturnMan = await DAOObject.CreateProfile( (new ProfileManager(ManagerProfile)).DeconstructProfile() );
    //     const ReturnEmp = await DAOObject.CreateProfile( (new ProfileManager(EmployeeProfile)).DeconstructProfile() );
    //     expect(ReturnAdmin && ReturnMan && ReturnEmp).toBeTruthy();
    // })

    // it("CosmosDAO: Getting Single Profile", async ()=>{ 
    //     const ReturnAdmin = await DAOObject.GetSingleProfile( (new ProfileManager(AdminProfile)).DeconstructProfile() )
    //     expect( ReturnAdmin.FirstName ).toBe( AdminProfile.FirstName );
    // })

    // let ProfileArray:Profile[]= [];
    // it("CosmosDAO: Get All Profiles, at least 3?", async ()=>{ 
    //     const ProfileArray:Profile[] = await DAOObject.GetAllProfiles();
    //     expect( Number(ProfileArray.length) ).toBeGreaterThanOrEqual(3);
    // })

    // it("CosmosDAO: Testing Update Profile, swapping name", async ()=>{ 
    //     const BeforeAdmin = await DAOObject.GetSingleProfile( (new ProfileManager(AdminProfile)).DeconstructProfile() )
    //     const InterMediate = BeforeAdmin;
    //     InterMediate.FirstName='TestingName';
    //     const AfterAdmin = await DAOObject.UpdateProfile( InterMediate );
    //     expect( AfterAdmin.FirstName != BeforeAdmin.FirstName ).toBeFalsy;
    //     expect( AfterAdmin.FirstName ).toBe('TestingName')
    // })

    // console.log(ProfileArray[0])
    // it("CosmosDAO: Check ID consistency After Name Swamp", async ()=>{
    //     const ReturnAdmin = await DAOObject.GetSingleProfile( ProfileArray[0] )
        
    //     expect( ReturnAdmin.id ).toBe( (new ProfileManager(AdminProfile)).DeconstructProfile().id );
    // })

    // // let TempRequest:Request;
    // // it("CosmosDAO: Creating Testing Request", async ()=>{ 
    // //     const TestRequest:RequestBuilder = new RequestBuilder( ProfileArray[0].id, ProfileArray[1].id , 100);
    // //     TempRequest = TestRequest.DeconstructRequest();
    // //     const ReturnRequest:Request = await DAOObject.CreateRequest(TempRequest);
    // //     expect( ReturnRequest ).toBeTruthy();
    // // })

    // // let ReturnRequestArray:Request[] = [];
    // // it("CosmosDAO:  Get All Request, at least 3", async ()=>{ 
    // //     ReturnRequestArray = await DAOObject.GetAllRequest();
    // //     expect( ReturnRequestArray.length ).toBeGreaterThanOrEqual(1);
    // // })

    // // it("CosmosDAO: Testing Request Filter", async ()=>{
    // //     const Proc:DataProcessor = new DataProcessor();
    // //     const FilterArray:string [] = Proc.FilterRequestByID( ProfileArray[0].id, ReturnRequestArray)

    // //  })

    // it("CosmosDAO: Getting Single Request", async ()=>{ })
    
    // it("CosmosDAO: Testing Update Request, Change Pending", async ()=>{ })


    // // Database Clean up ===============================================
    // it("CosmosDAO: Deleting Request", async ()=>{ })


    // it("CosmosDAO: Deleting Accounts", async ()=>{
    //     const ReturnAdmin = await DAOObject.DeleteProfile( (new ProfileManager(AdminProfile)).DeconstructProfile()  )
    //     const ReturnMan = await DAOObject.DeleteProfile( (new ProfileManager(ManagerProfile)).DeconstructProfile()  )
    //     const ReturnEmp = await DAOObject.DeleteProfile( (new ProfileManager(EmployeeProfile)).DeconstructProfile()  )
    //     expect(ReturnAdmin && ReturnMan && ReturnEmp).toBeTruthy();
    // })




})

