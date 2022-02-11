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
              "href": "https://localhost:5001/api/v1/assetgroups?page_number=1&page_size=3",
              "rel": "self",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id": "329714c0-c1a3-44e1-b355-b71eb1a0cc64",
              "asset_group": "Engineering Equipment",
              "asset_group_code": "EE",
              "pics": [
                {
                  "district_code": "JIEP",
                  "departement_code": "TREA"
                }
              ],
              "created_at": "2022-02-03T15:06:42.864713"
            },
            {
              "id": "02e676f0-114e-403a-a549-e432c28b53f3",
              "asset_group": "Computer Equipment",
              "asset_group_code": "CE",
              "pics": [
                {
                  "district_code": "JIEP",
                  "departement_code": "TREA"
                }
              ],
              "created_at": "2022-02-03T09:10:53.824508"
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
