import {CosmosClient, ItemResponse}  from "@azure\\cosmos";
import {GetPrimaryConnectionKey, GetDataBaseName, GetProfileContainerName, GetRequestContainerName} from "../DateBaseStringValues";


describe('Test', ()=>{

    it("Check Primary Key", async ()=>{
        const Temp:string = GetPrimaryConnectionKey();
        expect(Temp).toBeTruthy()
    })
    it("Check Database Name", async ()=>{
        const Temp:string = GetDataBaseName();
        expect(Temp).toBeTruthy()
    })
    it("Check Profile Container Name", async ()=>{
        const Temp:string = GetProfileContainerName();
        expect(Temp).toBeTruthy()
    })
    it("Check Request Container Name", async ()=>{
        const Temp:string = GetRequestContainerName();
        expect(Temp).toBeTruthy()
    })

})