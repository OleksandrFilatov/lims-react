export const UserTypeHeader = (t) => {
    return [
        { key: 'userType_id', label: t('User Type ID'), align: 'left' },
        { key: 'userType', label: t('User Type'), align: 'right' },
        { key: 'labInput', label: t('Input'), align: 'right', sorter: false },
        { key: 'labAnalysis', label: t('Analysis'), align: 'right', sorter: false },
        { key: 'labAdmin', label: t('Admin'), align: 'right', sorter: false },
        { key: 'stockUser', label: t('User'), align: 'right', sorter: false },
        { key: 'stockAdmin', label: t('Admin'), align: 'right', sorter: false },
        { key: 'hsImport', label: t('Import'), align: 'right', sorter: false },
        { key: 'hsExport', label: t('Export'), align: 'right', sorter: false },
        { key: 'hsAdmin', label: t('Admin'), align: 'right', sorter: false },
        { key: 'geologyImport', label: t('Import'), align: 'right', sorter: false },
        { key: 'geologyExport', label: t('Export'), align: 'right', sorter: false },
        { key: 'geologyAdmin', label: t('Admin'), align: 'right', sorter: false },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const UserHeader = (t) => {
    return [
        { key: 'user_id', label: t('User ID'), align: 'left' },
        { key: 'userName', label: t('User Name'), align: 'right' },
        { key: 'email', label: t('Email'), align: 'right', sorter: false },
        { key: 'password', label: t('Password'), align: 'right', sorter: false },
        { key: 'user_type', label: t('User Type'), align: 'right', sorter: false },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const PackingTypeHeader = (t) => {
    return [
        { key: 'packingType_id', label: t('Packing Type ID'), align: 'left' },
        { key: 'packingType', label: t('Packing Type'), align: 'right' },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const UnitTypeHeader = (t) => {
    return [
        { key: 'unit_id', label: t('Unit ID'), align: 'left' },
        { key: 'unit', label: t('Unit'), align: 'right' },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const ObjectiveHeader = (t) => {
    return [
        { key: 'objective_id', label: t('Objective ID'), align: 'left' },
        { key: 'objective', label: t('Objective'), align: 'right' },
        { key: 'units', label: t('Units'), align: 'right', sorter: false },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const AnalysisTypeHeader = (t) => {
    return [
        { key: 'analysisType_id', label: t('Analysis Type ID'), align: 'left' },
        { key: 'analysisType', label: t('Analysis Type'), align: 'right' },
        { key: 'norm', label: t('Norm'), align: 'right' },
        { key: 'objectives', label: t('Objectives'), align: 'right', sorter: false },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const ClientHeader = (t) => {
    return [
        { key: 'name', label: t('Name'), align: 'left' },
        { key: 'clientId', label: t('Client ID'), align: 'right' },
        { key: 'other', label: t('Other'), align: 'right' },
        { key: 'countryB', label: t('Country B'), align: 'right', sorter: false },
        { key: 'zipCodeB', label: t('Zip Code B'), align: 'right', sorter: false },
        { key: 'cityB', label: t('City B'), align: 'right', sorter: false },
        { key: 'addressB', label: t('Address B'), align: 'right', sorter: false },
        { key: 'address2B', label: t('Address 2B'), align: 'right', sorter: false },
        { key: 'address3B', label: t('Address 3B'), align: 'right', sorter: false },
        { key: 'address_street', label: t('Address Street'), align: 'right', sorter: false },
        { key: 'email', label: t('Email'), align: 'right', sorter: false },
        { key: 'email2', label: t('Email 2'), align: 'right', sorter: false },
        { key: 'email3', label: t('Email 3'), align: 'right', sorter: false },
        { key: 'remark1', label: t('Remark 1'), align: 'right', sorter: false },
        { key: 'remark2', label: t('Remark 2'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const ReasonHeader = (t) => {
    return [
        { key: 'reason_id', label: t('Reason ID'), align: 'left' },
        { key: 'reason', label: t('Reason'), align: 'right' },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const SampleTypeHeader = (t) => {
    return [
        { key: 'sampleType_id', label: t('Sample Type ID'), align: 'left' },
        { key: 'sampleType', label: t('Sample Type'), align: 'right' },
        { key: 'material', label: t('Material'), align: 'right' },
        { key: 'client', label: t('Client'), align: 'right' },
        { key: 'packingType', label: t('Packing Type'), align: 'right' },
        { key: 'stockSample', label: t('Stock Sample'), align: 'right' },
        { key: 'dueDate', label: t('Due Date'), align: 'right' },
        { key: 'sampleDate', label: t('Sample Date'), align: 'right' },
        { key: 'sendingDate', label: t('Sending Date'), align: 'right' },
        { key: 'analysisType', label: t('Analysis Type'), align: 'right' },
        { key: 'incomingProduct', label: t('Incoming Product'), align: 'right' },
        { key: 'distributor', label: t('Distributor'), align: 'right' },
        { key: 'certificateType', label: t('Certificate Type'), align: 'right' },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const MaterialHeader = (t) => {
    return [
        { key: 'material_id', label: t('Material ID'), align: 'left' },
        { key: 'material', label: t('Material'), align: 'left' },
        { key: 'aTypesValues', label: t('AnalysisType-Objectives'), align: 'left' },
        { key: 'remark', label: t('Remark'), align: 'left', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const CertificateTemplateHeader = (t) => {
    return [
        { key: 'name', label: t('Name'), align: 'left' },
        { key: 'certificatetitle', label: t('Certificate Title'), align: 'right' },
        { key: 'company', label: t('Company'), align: 'right' },
        { key: 'logo_filename', label: t('Logo'), align: 'right', sorter: false },
        { key: 'place', label: t('Place'), align: 'right', sorter: false },
        { key: 'date_format', label: t('Date Format'), align: 'right', sorter: false },
        { key: 'productData', label: t('Product Data'), align: 'right', sorter: false },
        { key: 'tableCol', label: t('Table Columns'), align: 'right', sorter: false },
        { key: 'freetext', label: t('Free Text'), align: 'right', sorter: false },
        { key: 'footer_filename', label: t('Footer'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const laboratoryFields = [
    { key: "_id", label: "ID" },
    { key: "due_date", label: "Due Date" },
    { key: "sample_type", label: "Sample Type" },
    { key: "productCode", label: "Customer P.O.no" },
    { key: "material", label: "Material" },
    { key: "material_category", label: "Material Category" },
    { key: "client", label: "Client" },
    { key: "packing_type", label: "Packing Type" },
    { key: "a_types", label: "Analysis Type" },
    { key: "c_types", label: "Certificate" },
    { key: "sending_date", label: "Sending Date" },
    { key: "sample_date", label: "Sample Date" },
    { key: "distributor", label: "Distributor" },
    { key: "geo_locaion", label: "Geo Location" },
    { key: "remark", label: "Remark" },
    { key: "weight", label: "Weight" },
    { key: "material_left", label: "Material Left" },
    { key: "lot_number", label: "Lot Number" },
    { key: "stock_sample", label: "Stock Sample" },
    { key: "delivering_address_name1", label: "Delivering.Address.Name1" },
    { key: "delivering_address_title", label: "Delivering.Address.Title" },
    { key: "delivering_address_country", label: "Delivering.Address.Country" },
    { key: "delivering_address_name2", label: "Delivering.Address.Name2" },
    { key: "delivering_address_name3", label: "Delivering.Address.Name3" },
    { key: "delivering_address_street", label: "Delivering.Address.Street" },
    { key: "delivering_address_zip", label: "Delivering.Address.ZIP" },
    { key: "delivering_customer_product_code", label: "CustomProductCode" },
    { key: "delivering_email_address", label: "E-mail Address" },
    { key: "delivering_fetch_date", label: "Fetch Date" },
    { key: "delivering_order_id", label: "Order.ID" },
    { key: "delivering_pos_id", label: "Pos.ID" },
    { key: "delivering_w_target", label: "Weight(target)" },
];

export const analysis_fields = [
    { key: "analysisType", label: "Analysis Type" },
    { key: "norm", label: "Norm" },
    { key: "objectives", label: "Objectives" },
    { key: "remark", label: "Remark" }
]

export const client_fields = [
    { key: "name", label: "Name" },
    { key: "countryB", label: "Country B" },
    { key: "zipCodeB", label: "Zip Code B" },
    { key: "cityB", label: "City B" },
    { key: "addressB", label: "Address B" },
    { key: "address2B", label: "Address2 B" }
]

export const certificateTemplateExcelHeader = (t) => [
    { key: "name", label: t('Name') },
    { key: "certificatetitle", label: t('Certificate Title') },
    { key: "company", label: t('Company') },
    { key: "logo", label: t('Logo') },
    { key: "place", label: t('Place') },
    { key: "date_format", label: t('Date Format') },
    { key: "productTitle", label: t('Product Title') },
    { key: "productdata", label: t('Product Data') },
    { key: "tablecolumns", label: t('Table Columns') },
    { key: "freetext", label: t('Free Text') },
    { key: "footer", label: t('Footer') },
    { key: "logoUid", label: t('Logo Uid') },
    { key: "footerUid", label: t('Footer Uid') },
    { key: "id", label: t('ID') },
]

export const MaterialExcelHeader = (t) => [
    { key: 'material_id', label: t('Material ID') },
    { key: 'material', label: t('Material') },
    { key: 'client', label: t('Client') },
    { key: 'combination', label: t('Combination') },
    { key: 'remark', label: t('Remark') },
    { key: '_id', label: t("Id") },
];

export const CertificateTypeHeader = (t) => [
    { key: 'certificateType_id', label: t('Certificate Type ID') },
    { key: 'material', label: t('Material'), align: 'right' },
    { key: 'certificateType', label: t('Certificate Type'), align: 'right' },
    { key: 'analysises', label: t('AnalysisType-Objectives'), align: 'right' },
    { key: 'remark', label: t('Remark'), align: 'right' },
    { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
    { key: '_id', label: "Id" }
]

export const InputLaboratoryHeader = (t) => [
    { key: 'due_date', label: t('Due Date') },
    { key: 'sample_type', label: t('Sample Type'), align: 'left' },
    { key: 'material', label: t('Material'), align: 'left' },
    { key: 'material_category', label: t('Material Category'), align: 'left' },
    { key: 'client', label: t('client'), align: 'left' },
    { key: 'packing_type', label: t('Packing Type'), align: 'left' },
    { key: 'a_types', label: t('Analysis Type'), align: 'left' },
    { key: 'c_types', label: t('Certificate'), align: 'left' },
    { key: 'sending_date', label: t('Sending Date'), align: 'left' },
    { key: 'sample_date', label: t('Sample Date'), align: 'left' },
    { key: 'weight', label: t('Weight(actual)[kg]'), align: 'left' },
    { key: 'material_left', label: t('Material Left'), align: 'left' },
    { key: 'lot_number', label: t('Lot Number'), align: 'left' },
    { key: 'stock_sample', label: t('Stock Sample'), align: 'left' },
    { key: 'remark', label: t('Remark'), align: 'left' },
    { key: 'buttonGroups', label: '', align: 'left', _style: { width: '84px', display: 'none' } },
    { key: '_id', label: "Id" },
    { key: 'orderId', label: "Order.Id" },
    { key: 'posId', label: "Pos.Id" },
]

export const input_laboratory_excel_header = [
    { key: "_id", label: "ID" },
    { key: "due_date", label: "Due Date" },
    { key: "sample_type", label: "Sample Type" },
    { key: "productCode", label: "Customer P.O.no" },
    { key: "material", label: "Material" },
    { key: "material_category", label: "Material Category" },
    { key: "client", label: "Client" },
    { key: "packing_type", label: "Packing Type" },
    { key: "a_types", label: "Analysis Type" },
    { key: "c_types", label: "Certificate" },
    { key: "sending_date", label: "Sending Date" },
    { key: "sample_date", label: "Sample Date" },
    { key: "distributor", label: "Distributor" },
    { key: "geo_locaion", label: "Geo Location" },
    { key: "remark", label: "Remark" },
    { key: "weight", label: "Weight" },
    { key: "weight_comment", label: "Weight Comment" },
    { key: "material_left", label: "Material Left" },
    { key: "lot_number", label: "Lot Number" },
    { key: "stock_sample", label: "Stock Sample" },
    { key: "aT_validate", label: "AnalysisType Validate" },
    { key: "stock_specValues", label: "Stock Spec Values" },
    { key: "stock_weights", label: "Stock Weights" },
    { key: "delivering_address_name1", label: "Delivering.Address.Name1" },
    { key: "delivering_address_title", label: "Delivering.Address.Title" },
    { key: "delivering_address_country", label: "Delivering.Address.Country" },
    { key: "delivering_address_name2", label: "Delivering.Address.Name2" },
    { key: "delivering_address_name3", label: "Delivering.Address.Name3" },
    { key: "delivering_address_Place", label: "Delivering.Address.Place" },
    { key: "delivering_address_street", label: "Delivering.Address.Street" },
    { key: "delivering_address_zip", label: "Delivering.Address.ZIP" },
    { key: "delivering_customer_product_code", label: "CustomProductCode" },
    { key: "delivering_email_address", label: "E-mail Address" },
    { key: "delivering_fetch_date", label: "Fetch Date" },
    { key: "delivering_order_id", label: "Order.ID" },
    { key: 'delivering_customer_order_id', label: 'Customer OrderID' },
    { key: "delivering_pos_id", label: "Pos.ID" },
    { key: "delivering_w_target", label: "Weight(target)" },
    { key: "deliveryId", label: "Delivery ID" },
];

export const import_column_list = [
    { key: 'Artikel', label: "Material/PackingId" },
    { key: 'Artikeltext', label: "[Do not use]" },
    { key: 'Auftragsnummer', label: "Customer Order ID" },
    { key: 'Beleg', label: "Order.ID" },
    { key: 'Fremdartikelnummer', label: "Customer Product Code" },
    { key: 'Kundennummer', label: "Client" },
    { key: 'Ladedatum', label: "Fetch Date" },
    { key: 'Lf.adr. E-Mail', label: "E-mail Address" },
    { key: 'Lf.adr. Land', label: "Delivering.Address.Country" },
    { key: 'Lf.adr. Name 1', label: "Delivering.Address.Name1" },
    { key: 'Lf.adr. Name 2', label: "Delivering.Address.Name2" },
    { key: 'Lf.adr. Name 3', label: "Delivering.Address.Name3" },
    { key: 'Lf.adr. Ort', label: "Delivering.Address.Place" },
    { key: 'Lf.adr. PLZ', label: "Delivering.Address.ZIP" },
    { key: 'Lf.adr. Stra�e', label: "Delivering.Address.Street" },
    { key: 'Menge (PE)', label: "Weight(target)[kg]" },
    { key: 'Pos. Liefer-/Leistungsdatum', label: "Fetch Date" },
    { key: 'Pos. Nummer', label: "Pos.ID" },
    { key: 'Versanddatum', label: "Due Date" },
    { key: "Storno", label: "Storno" }
];

export const laboratory_columns = [
    { key: "sample_type", label: "Sample Type" },
    { key: "client", label: "Client" },
    { key: "material", label: "Material" },
    { key: "material_category", label: "Material Category" },
    { key: "packing_type", label: "Packing Type" },
    { key: "a_types", label: "Analysis Type" },
    { key: "c_types", label: "Certificate Type" },
    { key: "due_date", label: "Due Date" },
    { key: "sample_date", label: "Sample Date" },
    { key: "distributor", label: "Distributor" },
    { key: "geo_location", label: "Geo-location" },
    { key: "remark", label: "Remark" },
    { key: "name1", label: "Delivering.Address.Name1" },
    { key: "name2", label: "Delivering.Address.Name2" },
    { key: "name3", label: "Delivering.Address.Name3" },
    { key: "title", label: "Delivering.Address.Title" },
    { key: "country", label: "Delivering.Address.Country" },
    { key: "place", label: "Delivering.Address.Place" },
    { key: "street", label: "Delivering.Address.Street" },
    { key: "zipcode", label: "Delivering.Address.ZIP" },
    { key: "productCode", label: "Customer Product Code" },
    { key: "email", label: "E-mail Address" },
    { key: "fetchDate", label: "Fetch Date" },
    { key: "orderId", label: "Order.ID" },
    { key: "customer_orderId", label: "Customer Order ID" },
    { key: "posId", label: "Pos.ID" },
    { key: "w_target", label: "Weight(target)[kg]" }
];

export const anlysisLaboratoryHeader = [
    { key: "charge", label: "Charge(LOT)" },
    { key: "material", label: "Material" },
    { key: "client", label: "Client" },
    { key: "combination", label: "Analysis Type/Objective" },
    { key: "weight", label: "Actual Weight" },
    { key: "limitValue", label: "Current Value" },
    { key: "c_date", label: "Date" },
    { key: "his_val_1", label: "Historic Value 1" },
    { key: "his_date_1", label: "Date 1" },
    { key: "his_val_2", label: "Historic Value 2" },
    { key: "his_date_2", label: "Date 2" },
    { key: "his_val_3", label: "Historic Value 3" },
    { key: "his_date_3", label: "Date 3" },
    { key: "his_val_4", label: "Historic Value 4" },
    { key: "his_date_4", label: "Date 4" },
    { key: "his_val_5", label: "Historic Value 5" },
    { key: "his_date_5", label: "Date 5" },
    { key: "his_val_6", label: "Historic Value 6" },
    { key: "his_date_6", label: "Date 6" },
    { key: "his_val_7", label: "Historic Value 7" },
    { key: "his_date_7", label: "Date 7" },
];

export const OreTypeHeader = (t) => {
    return [
        { key: 'oreType_id', label: t('OreType ID'), align: 'left' },
        { key: 'oreType', label: t('OreType'), align: 'right' },
        { key: 'remark', label: t('Remark'), align: 'right', sorter: false },
        { key: 'buttonGroups', label: '', align: 'right', _style: { width: '84px', display: 'none' } },
        { key: "_id", label: 'Id' }
    ]
}

export const GeologyHeader = (t) => {
    return [
        { key: 'geology_id', label: t('Geology ID'), align: 'left' },
        { key: 'hole_id', label: t('Hole ID'), align: 'right' },
        { key: 'materialType', label: t('Material Type'), align: 'right' },
        { key: 'east', label: t('East'), align: 'right' },
        { key: 'north', label: t('North'), align: 'right' },
        { key: 'elev', label: t('Elev'), align: 'right' },
        { key: 'length', label: t('Length'), align: 'right' },
        { key: 'category', label: t('Category'), align: 'right' },
        { key: 'to', label: t('To'), align: 'right' },
        { key: 'azimut', label: t('Azimut'), align: 'right' },
        { key: 'dip', label: t('Dip'), align: 'right' },
        { key: 'date', label: t('Sample Date'), align: 'right' },
        { key: 'level', label: t('Level'), align: 'right' },
        { key: 'subset', label: t('Subset'), align: 'right' },
        { key: 'thickness', label: t('Thickness'), align: 'right' },
        { key: 'distance', label: t('Distance'), align: 'right' },
        { key: 'weight', label: t('Weight'), align: 'right' },
        { key: 'sample', label: t('Sample'), align: 'right' },
        { key: 'from', label: t('From'), align: 'right' },
        { key: 'geo_to', label: t('To'), align: 'right' },
        { key: 'thk', label: t('THK'), align: 'right' },
        { key: 'ore', label: t('Ore Type'), align: 'right' },
        { key: 'rxqual', label: t('Rxqual'), align: 'right' },
        { key: 'fest', label: t('Fest'), align: 'right' },
        { key: 'locker', label: t('Locker'), align: 'right' },
        { key: 'sanding', label: t('Sanding'), align: 'right' },
        { key: 'drills', label: t('Drills'), align: 'right' },
        { key: "_id", label: 'Id' }
    ]
}

export const GeologyLabObjectiveHeader = (t) => {
    return [
        { key: 'objective_id', label: t('Objective ID') },
        { key: 'objective', label: t('Objective') },
        { key: 'remark', label: t('Remark') },
        { key: "_id", label: 'Id' }
    ]
}