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
              "href": "https://localhost:5001/api/v1/budgetplanitemgroups/xxx-xxx-xxx-xxx/buildingattachments?page_number=1&page_size=3",
              "rel": "self",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
              "type": "OUTSTANDING PLAN PAYMENT",
              "district_code": "JIEP",
              "detail": "PEK. PENAMBAHAN ATAP OIL STORAGE (UK.5 X 14 M)",
              "currency": "IDR",
              "current_period_idr": 347000000,
              "current_period_usd": 347000000,
              "mb_idr": 347000000,
              "mb_usd": 347000000
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
