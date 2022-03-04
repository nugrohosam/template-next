import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "success": true,
        "message": "success get data",
        "data": {
          "paging": {
            "total_items": 2,
            "page_number": 1,
            "page_size": 2,
            "total_pages": 1
          },
          "links": [
            {
              "href": "https://api.ewgp.dot.co.id/api/v1/audits?page_size=2&page_number=1&resource_type=accrued&resource_id=117a1491-93b3-4f87-b19d-f073b3354578&order_by=created_at&order_sort=asc",
              "rel": "self",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id": "9b21be52-f6f2-4064-b726-6b1d9db6f500",
              "resource_id": "431b3e5f-cb70-4a8c-8a75-0da8bfb02405",
              "resource_type": "accrued",
              "status_from": "SUBMITTED",
              "status_to": "WAITING_APPROVAL",
              "notes": null,
              "user_nrp": "p61191028",
              "user_position": "HO6FI014",
              "user_name": "HIDAYAT TRI ROCHMADI",
              "workflow_level": 0,
              "created_at": "2021-09-25 08:43:22"
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
