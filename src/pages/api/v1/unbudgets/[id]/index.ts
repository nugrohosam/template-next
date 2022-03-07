import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "success": true,
        "message": "success get detail data",
        "data": {
          "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
          "id_capex_budget_plan": "211afc10-4f0e-493d-9931-f2ff60d500cd",
          "budget_code": "UNBUD/CE/1/2022/ABKL/ITIF/SINS/SMIO/001",
          "currency": "IDR",
          "status": "draft",
          "item": 4,
          "total_amount": 4000000,
          "total_amount_usd": 4000,
          "outstanding_plan_payment_attachment": null,
          "outstanding_retention_attachment": null,
          "unbudget_background": "Camera monitoring pergerakan slope, printer sebagai instrumen cetak koordinat pergerakan slope",
          "unbudget_impact_if_not_realized": "Pergerakan slope tidak termonitor 24 jam, rawan longsor",
          "unbudget_attachment": "attachment_20220101.pdf",
          "is_building": false,
          "workflow_approval_level": 0,
          "workflow_approval_nrp": [],
          "workflow_approval_position": [],
          "workflow_approval_name": [],
          "created_at": "2021-08-23 11:34:41"
        },
        "errors": null
      }
    `)
  );
}
