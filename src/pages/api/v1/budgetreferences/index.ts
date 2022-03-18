import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "success": true,
        "message": "success get list data",
        "data": {
          "paging": {
            "total_items": 1,
            "page_number": 1,
            "page_size": 1,
            "total_pages": 1
          },
          "links": [
            {
              "href": "https://localhost:5001/api/v1/budgetreferences?page_number=1&page_size=3",
              "rel": "self",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
              "budget_code": "BUD/CE/1/2022/ABKL/ITIF/SINS/SMIO/001",
              "district_code": "JIEP",
              "division_code": "FATB",
              "department_code": "TREA",
              "currency": "IDR",
              "balance": 4000000,
              "current_balance": 4000000,
              "qty": 4,
              "currency_qty": 3,
              "price_per_unit": 1000000,
              "description": "description"
            },
            {
              "id": "16ba30af-fa24-44cd-aa0a-5f76565c5a1d",
              "budget_code": "UNBUD/CE/1/2021/ABKL/TREA/SINS/SMIO/001-001",
              "description": "description budget ref",
              "district_code": "ABKL",
              "division_code": "OPRT",
              "department_code": "SMIO",
              "currency": "IDR",
              "balance": 72000000,
              "current_balance": 72000000,
              "qty": 0,
              "current_qty": 0,
              "price_per_unit": 0
            },
            {
              "id": "c2ee29d2-868a-46f6-8159-23fea4b2bab9",
              "budget_code": "BUD/EE/2/2024/JIEP/TREA/06/TREA/015-001",
              "description": null,
              "district_code": "JIEP",
              "division_code": "FATB",
              "department_code": "TREA",
              "currency": "USD",
              "balance": 39150000,
              "current_balance": 39150000,
              "qty": 540,
              "current_qty": 540,
              "price_per_unit": 5
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
