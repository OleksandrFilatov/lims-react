import * as React from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { ServerUri } from "../config";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axiosFetch from "./axiosFetch";

const Gpdf = ({ pdfdata, pdfcolumns, labId, cType, updateData }) => {

  const container = React.useRef(null);
  const pdfExportComponent = React.useRef(null);
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
      const requestData = {
        labId: labId,
        cType: cType
      }
      axiosFetch.post('/api/inputLabs/download_status', requestData)
        .then(res => {
          updateData(res.data);
        }).catch(err => console.log(err.response.data))
    }
  };

  return (
    <div>
      <div className="example-config text-right py-2">
        <Button variant="contained" onClick={exportPDFWithComponent}>
          Download PDF
        </Button>
      </div>
      <div className="border rounded p-4">
        <PDFExport
          ref={pdfExportComponent}
          paperSize={"A4"}
          margin={{
            top: "0.5cm",
            left: "2.3cm",
            right: "2.3cm",
            bottom: "0.5cm",
          }}
          fileName={pdfdata[0].filename}
          author="aaa"
        >
          {
            pdfdata.map((data, index) => (
              <div ref={container} key={index}>
                <div className={`d-flex ${(data.header_styles.left === 0 && data.header_styles.top === 0) ? `justify-content-center` : ``} align-items-center mb-4`} id="pdfHeader">
                  {
                    (data.header_styles.width !== 0 || data.header_styles.height !== 0) ? (
                      <img
                        src={`${ServerUri}/uploads/certificates/${data.logo}`}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "/static/image-not-found.png";
                        }}
                        style={{
                          marginTop: `${data.header_styles.top}cm`,
                          marginLeft: `${data.header_styles.left}cm`,
                          width: `${data.header_styles.width !== 0 ? data.header_styles.width + `cm` : `auto`}`,
                          height: `${data.header_styles.height !== 0 ? data.header_styles.height + `cm` : `auto`}`
                        }}
                        alt=""
                      />
                    ) : (
                      <img
                        src={`${ServerUri}/uploads/certificates/${data.logo}`}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "/static/image-not-found.png";
                        }}
                        alt=""
                      />
                    )
                  }
                </div>
                <div className="reactPdf">
                  <div className="d-flex">
                    <div className="w-50 px-4">
                      <p className="transform-scale-1-1 mb-1 px-4">
                        {data.address.name}&nbsp;
                      </p>
                      {data.address.addressB !== "" && (
                        <p className="transform-scale-1-1 mb-1 px-4">
                          {data.address.addressB}&nbsp;
                        </p>
                      )}
                      {(data.address.zipcodeB !== "" || data.address.cityB !== "") && (
                        <p className="transform-scale-1-1 mb-1 px-4">
                          {data.address.zipcodeB}&nbsp;
                          {data.address.cityB}&nbsp;
                        </p>
                      )}
                      {data.address.address2B !== "" && (
                        <p className="transform-scale-1-1 mb-1 px-4">
                          {data.address.address2B}&nbsp;
                        </p>
                      )}
                      {data.address.country !== "" && (
                        <p className="transform-scale-1-1 mb-1 px-4">
                          {data.address.country}&nbsp;
                        </p>
                      )}
                    </div>
                    <div className="d-flex justify-content-end w-50 px-4">
                      <p className="transform-scale-1-1 mb-1 px-4">
                        {data.place}, {data.date}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex flex-direction-column">
                      <div className="text-center mx-auto bold text-decoration-underline my-2" style={{ fontSize: '28px' }}>
                        {data.c_title}
                      </div>
                      <div className="text-center mx-auto my-2">
                        {data.productName}
                      </div>
                      <table width="100%" className="test px-4 borderless-table">
                        <tbody>
                          {data.productData.map((v, i) => (
                            <tr key={i}>
                              <td align="left" className="transform-scale-1-1 borderless-table">{v.name}</td>
                              <td align="left" className="transform-scale-1-1 borderless-table">
                                {v.value ? v.value : "Not yet configured"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mb-3">
                    {(pdfcolumns.length > 0 && pdfcolumns[index].length > 0) && (
                      <div className="ctable certificate-doc">
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                {
                                  pdfcolumns[index].map((col) => (
                                    <TableCell key={col.fieldname}>{col.name}</TableCell>
                                  ))
                                }
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                data.tableValues.map((row, i) => (
                                  <TableRow
                                    key={i}
                                  >
                                    {
                                      pdfcolumns[index].map((col, ii) => (
                                        <TableCell key={ii}>{row[col.fieldname]}</TableCell>
                                      ))
                                    }
                                  </TableRow>
                                ))
                              }
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    )}
                  </div>

                  <div className="d-flex">
                    <table width="100%" className="borderless-table">
                      <tbody>
                        {data.freetext.split("\n").map((v, i) => (
                          <tr key={i}>
                            <td align="left" className="borderless-table" style={{ lineHeight: '1rem !important' }}>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={`d-flex ${(data.footer_styles.left === 0 && data.footer_styles.bottom === 0) ? `justify-content-center` : ``} align-items-center mb-4`}>
                    {
                      (data.footer_styles.width !== 0 || data.footer_styles.height !== 0) ? (
                        <img
                          src={`${ServerUri}/uploads/certificates/${data.footer}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/static/image-not-found.png";
                          }}
                          style={{
                            marginBottom: `${data.footer_styles.bottom}cm`,
                            marginLeft: `${data.footer_styles.left}cm`,
                            width: `${data.footer_styles.width !== 0 ? data.footer_styles.width + `cm` : 'auto'}`,
                            height: `${data.footer_styles.height !== 0 ? data.footer_styles.height + `cm` : 'auto'}`
                          }}
                          alt=""
                        />
                      ) : (
                        <img
                          src={`${ServerUri}/uploads/certificates/${data.footer}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/static/image-not-found.png";
                          }}
                          alt=""
                        />
                      )
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </PDFExport>
      </div>
    </div>
  );
};
export default Gpdf;
