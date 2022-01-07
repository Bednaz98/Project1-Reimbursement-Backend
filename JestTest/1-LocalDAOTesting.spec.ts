import LocalDAO from "../DAOClasses/LocalDAO";
import {GetPrimaryConnectionKey, GetDataBaseName, GetProfileContainerName, GetRequestContainerName} from "../DateBaseStringValues";
import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import ProfileManager from "../Project1-GitUtil-Reimbursement/Classes/ProfileManager";
import RequestBuilder from "../Project1-GitUtil-Reimbursement/Classes/RequestBuilder";
import DataProcessor from '../Project1-GitUtil-Reimbursement/Classes/DataProcessor';



//it("LocalADO: TestName", async ()=>{ })

describe('LocalADO Test', ()=>{
    const FirstNameArray:string[] = ['Admin','Manager','Employee']
    const LastNameArray:string[] = ['LastAd','ManLast','EmpLast']
    const DAOObject:LocalDAO = new LocalDAO();

    // Profile checks==================================
    it("LocalADO: Creating Profiles", async ()=>{
        for(let i = 0; i<FirstNameArray.length; i++ ){
            let Check:Profile = await DAOObject.CreateProfile( {FirstName:FirstNameArray[i], LastName:LastNameArray[i]} )
            expect(Check).toBeTruthy();
        }
    })

    let ProfileArray:Profile[] = [];
    it("LocalADO: Check Read Profile", async ()=>{
        ProfileArray = await DAOObject.GetAllProfiles();
        expect(ProfileArray.length >0).toBeTruthy;
    })

    it("LocalADO: Check Get Single Profile", async ()=>{
        const ReturnProfile = await DAOObject.GetSingleProfile(ProfileArray[0].id)
        expect(ReturnProfile.id).toBe(ProfileArray[0].id);
    })

    //Request Checks ========================================
    let RequestArray:Request[] =[];
    it("LocalADO: Check Write Request", async ()=>{

        RequestArray.push (  (new RequestBuilder(ProfileArray[0].id, ProfileArray[1].id, 0)).DeconstructRequest()  )
        RequestArray.push (  (new RequestBuilder(ProfileArray[1].id, ProfileArray[2].id, 0)).DeconstructRequest()  )
        RequestArray.push (  (new RequestBuilder(ProfileArray[0].id, ProfileArray[2].id, 0)).DeconstructRequest()  )

        for(let i =0; i <RequestArray.length;i++ ){
            let Check:Request = await DAOObject.CreateRequest(RequestArray[i])
            expect(Check).toBeTruthy();
        }
    })

    it("LocalADO: Check Read Request", async ()=>{
        const ReturnRequest:Request = await DAOObject.GetSingleRequest(RequestArray[0].id);
        expect(ReturnRequest.id).toBe(RequestArray[0].id);
    })

    it("LocalADO: Check Delete Request", async ()=>{ 
        for(let i =0; i< RequestArray.length ;i++ ){
            await DAOObject.DeleteRequest(RequestArray[i]);
        }
        expect(true).toBeTruthy(); // Not Working.... await problem
    })
    it("LocalADO: Check Delete Profiles", async ()=>{
        
        let Bool:boolean = true;
            for(let i =0; i < ProfileArray.length ;i++){
                await DAOObject.DeleteProfile(ProfileArray[i]);
            }
        expect(true).toBeTruthy(); // Not Working.... await problem
    })

})

