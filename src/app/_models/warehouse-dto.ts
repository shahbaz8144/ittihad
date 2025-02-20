export class WarehouseDTO {
  OrganizationId: number
  RoleId: number
  CreatedBy: number
  WareHouseName: string
  UserId: number
  Description: string
  Email: string
  Phone: Number;
  Address: string
  CityId:number
  CountryId:number
  IsActive: boolean
  FlagId: Number
  CountryCode:string;
  ContactUserName: ""
  WareHouseId: number
  message: string
  wareId: number
 
  WareName: string
  Note: string
  address: string
  Active: boolean
  CompanyIds : string;
  CompanyNames : string;
}
// "WareHouseName":"",
// "Description":"",
// "Phone":"",
// "Address":"",
// "Email":"",
// "CountryId":0,
// "CityId":0,
// "IsActive":true // boolean value,
// "OrganizationId":0,
// "ContactUserName":"",
// "CreatedBy":0,
// "flagid":1, //is for insert 2 is for update
// "WareHouseId":0 // if flag id is 1 then warehouse id is o else if flag id is 2 then pass warehouse id