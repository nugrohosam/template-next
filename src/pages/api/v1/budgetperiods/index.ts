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
            "total_items": 2,
            "page_number": 1,
            "page_size": 3,
            "total_pages": 1
          },
          "links": [
            {
              "href": "https://localhost:5001/api/v1/budgetperiods?page_number=1&page_size=3",
              "rel": "self",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id": "329714c0-c1a3-44e1-b355-b71eb1a0cc64",
              "district_code": "JIEP",
              "year": 2022,
              "type": "MB",
              "position": "UNFINAL",
              "status": "OPEN",
              "open_date": "2022-01-01",
              "close_date": "2022-01-20"
            },
            {
              "id": "02e676f0-114e-403a-a549-e432c28b53f3",
              "district_code": "ABKL",
              "year": 2022,
              "type": "MB",
              "position": "UNFINAL",
              "status": "OPEN",
              "open_date": "2022-01-01",
              "close_date": "2022-01-20"
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
