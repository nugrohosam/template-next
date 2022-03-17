import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "message": "success get detail data",
        "data": {
          "id": "xxx-xxx-xxxx-xxxx",
          "asset_group": {
            "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
            "asset_group": "Computer Equipment",
            "asset_group_code": "CE",
            "pics": null,
            "created_at": "2021-08-23 11:34:41"
          },
          "budget_reference": {
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
          "delivery_instruction": "delivery_instruction",
          "pr_number": "PR/JIEP/2020/2/FATB/TREA/7351/999/005/00030",
          "pr_number_ellipse": "PR1001",
          "pr_date": "2022-03-03",
          "requested_by": "p611xxx",
          "date_required": "2022-03-03",
          "district_code": "JIEP",
          "department_code": "TREA",
          "delivery_point": "AD01",
          "coa": "coa-xxx",
          "warehouse": "ABKL-COLN",
          "currency": "IDR",
          "supplier_recommendation": "000001",
          "supplier_recommendation_name": "John Doe",
          "quantity_required": 1,
          "estimated_price_usd": 20,
          "description": "Warehouse Komponen Midlife LOAN ABKL",
          "purchaser": "p611xxx",
          "payment_instruction": "PP",
          "authorized_by": "p611xxx",
          "material_group": "BLLD",
          "pic_asset": "p611xxx",
          "warranty_hold_payment": "YES",
          "uom": "BARL",
          "district_code_pembebanan": "ABKL",
          "attachment": "pr_attachment.pdf",
          "budget_qty_balance": 2,
          "budget_amount_balance": 90000,
          "currency_rate": 14000,
          "status": "DRAFT",
          "status_po": null,
          "items": [
            {
              "id": "xxx-xxx-xxxx-xxxx",
              "item": "001",
              "description_1": "Fortigate-60E",
              "description_2": "FC-10-0060E-950-02-36",
              "description_3": "DRMA-FG-60E",
              "description_4": "UTM",
              "part_no": "1001",
              "mnemonic": "ASHDOWN",
              "uom": "CBOY",
              "quantity": 1,
              "price_usd": 20
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
