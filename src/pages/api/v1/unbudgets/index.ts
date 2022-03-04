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
            "total_items": 6,
            "page_number": 1,
            "page_size": 3,
            "total_pages": 2
          },
          "links": [
            {
              "href": "http://localhost:5000/api/v1/unbudgets?page_number=1&page_size=3",
              "rel": "self",
              "method": "GET"
            },
            {
              "href": "http://localhost:5000/api/v1/unbudgets?page_number=2&page_size=3",
              "rel": "nextPage",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id": "80ac2dff-d306-4f49-ac20-2f939291b88a",
              "budget_code": "UNBUD/CE/1/2022/ABKL/ITIF/SINS/SMIO/001",
              "currency": "USD",
              "status": "draft",
              "item": 1,
              "total_amount": 9000000,
              "total_amount_usd": 400,
              "workflow_approval_level": null,
              "workflow_approval_nrp": [],
              "workflow_approval_position": [],
              "workflow_approval_name": [],
              "created_at": "2022-02-10T11:02:28.6023506"
            },
            {
              "id": "a8ee2d7b-335f-49c2-abc9-360be41870d8",
              "budget_code": "UNBUD/CE/1/2022/ABKL/ITIF/SINS/SMIO/002",
              "currency": "IDR",
              "status": "draft",
              "item": 1,
              "total_amount": 4000000,
              "total_amount_usd": 400,
              "workflow_approval_level": null,
              "workflow_approval_nrp": [],
              "workflow_approval_position": [],
              "workflow_approval_name": [],
              "created_at": "2022-02-10T11:02:28.3548699"
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
