export class MapDocumentDTO {
    SourceId :number;
    SourceName :string;
    DocumentTypeId :number;
    DocumentTypeName :string;
    Description:string;
    Phone:number;
    Address:string;
    Email:string;
    Fax:string;
    CountryId:number;
    CityId:number;
    Country:string;
    City:string
    ContactUser:string;
    IsActive:boolean;
    OrganizationId:number;
    CreatedBy:number;
    FlagId:number;
    message:string;
    RoleId:number;
    IsArchiving:boolean;
    IsCommunication:boolean
    DocumentTypeMappedJson:any;
    DocumentTypeJson:string;
    mapdocumenttypesxml : string;
    updatedocumenttypesxml:string;
}
