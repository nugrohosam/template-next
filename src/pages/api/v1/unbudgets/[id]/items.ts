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
              "href": "https://localhost:5001/api/v1/unbudgets/xxx-xxx-xxx-xxx",
              "rel": "self",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
              "budget_code": "UNBUD/CE/1/2022/ABKL/ITIF/SINS/SMIO/001-001",
              "catalog": {
                "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
                "detail": "D375A6R",
                "primary_currency": "USD",
                "price_in_idr": 1000,
                "price_in_usd": 10,
                "status": "Last Updated : 12 Okt 2019",
                "created_at": "2021-08-23 11:34:41",
                "asset_group": {
                  "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
                  "asset_group": "Computer Equipment",
                  "asset_group_code": "CE",
                  "pics": null,
                  "created_at": "2021-08-23 11:34:41"
                }
              },
              "detail": "CILE - PEK. PENGECORAN OPEN YARD ( M3 )",
              "price_per_unit": 200000,
              "currency": "IDR",
              "currency_rate": 10000,
              "total_amount": 400000,
              "total_amount_usd": 40,
              "items": [
                {
                  "month": 2,
                  "quantity": 2,
                  "amount": 400000
                }
              ],
              "created_at": "2021-08-23 11:34:41"
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
