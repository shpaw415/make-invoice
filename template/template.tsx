export type TemplateData = {
  type: "Facture" | string;
  date: Date | string;
  region: "CA" | "US" | "FR" | string;
  invoice_number: number | string;
  invoice_object: string;
  /** https://www.toptal.com/designers/htmlarrows/currency/ */
  curency: {
    type: "EUR" | "CAD" | "USD";
    /**
     *HEX code of the currency
     *
     * Ex: \u0024
     */
    hex: string;
  };
  my_company: {
    name: string;
    adress: string;
    phone_number: string;
    email: string;
    siren: string;
    bank?: {
      name: string;
      iban: string;
      bic: string;
    };
  };
  tax: Array<{
    active: boolean;
    rate: number;
    text: string;
  }>;
  customer: {
    name: string;
    adress: string;
    siren: string;
    tva_intra: string;
  };
  items: Array<{
    description: Array<{ item: string }>;
    amount: number;
    unit_price: number;
  }>;
  limit_date_paiement?: string;
  paiement_mode: Array<{ kind: string }>;
  legal_information?: string;
};

export default function Template({
  legal_information,
  paiement_mode,
  limit_date_paiement,
  tax,
  curency,
  my_company,
  date,
  type,
  invoice_object,
  items,
  customer,
  invoice_number,
  ...data
}: TemplateData) {
  const totalWoTax = items.reduce((p, n) => n.amount * n.unit_price + p, 0);
  const totalWithTax =
    tax.map((t) => (t.rate / 100) * totalWoTax).reduce((p, n) => p + n, 0) +
    totalWoTax;
  const formatter = (amount: number) => amount.toFixed(2);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Facture</title>
        <link rel="stylesheet" href="template/style.css" />
      </head>
      <body>
        <div className="wrapper">
          <div className="content">
            <div className="inbl w70">
              <p className="h1Like mb0 semiBold">{my_company.name}</p>
              <p>
                {my_company.adress}
                <br />
                Tel : {my_company.phone_number}
                <br />
                E-mail : {my_company.email}
              </p>
            </div>
            <div className="inbl txtRight w30">
              <p className="color1 h1Like semiBold uppercase">{type}</p>
            </div>

            <p className="mt1">Objet : {invoice_object}</p>

            <div className="borderTopColor1 inbl mt1 pt1 w70">
              <p className="bold mb0">Adressée à :</p>
              <p>
                {customer.name}
                <br />
                {customer.adress}
                <br />
                {customer.siren && `SIREN : ${customer.siren}`}
                <br />
                {customer.tva_intra &&
                  `N° de TVA Intra : ${customer.tva_intra}`}
              </p>
            </div>
            <div className="borderTopColor1 inbl mt1 pt1 w30">
              <div className="row">
                <div className="col">
                  <p className="bold txtRight">Facture n° :</p>
                </div>
                <div className="col txtRight">
                  <p className="bold">{invoice_number}</p>
                </div>
              </div>

              <div className="row">
                <div className="col txtRight">
                  <p>Date :</p>
                </div>
                <div className="col txtRight">
                  <p>
                    {date instanceof Date
                      ? date.toLocaleDateString(curency.type)
                      : date}
                  </p>
                </div>
              </div>
            </div>

            <table className="mt2 w100">
              <thead>
                <tr>
                  <th className="w50">Description</th>
                  <th className="txtRight w20">Tarif unitaire</th>
                  <th className="txtRight w10">Qté</th>
                  <th className="txtRight w20">Montant H.T.</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      {item.description.map((desciption, i) => (
                        <span key={i}>
                          {desciption.item}
                          <br />
                        </span>
                      ))}
                    </td>
                    <td className="txtRight">
                      {formatter(item.unit_price)} {curency.hex}
                    </td>
                    <td className="txtRight">{item.amount}</td>
                    <td className="txtRight">
                      {formatter(item.amount * item.unit_price)} {curency.hex}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt2 txtRight" colSpan={3}>
                    Sous-total H.T.
                  </td>
                  <td className="pt2 txtRight">
                    {formatter(totalWoTax)} {curency.hex}
                  </td>
                </tr>
                {tax.map((t, i) => (
                  <tr key={i}>
                    <td className="txtRight" colSpan={3}>
                      <span className="textTva">{t.text}</span>
                    </td>
                    <td className="txtRight">
                      {formatter((t.rate / 100) * totalWoTax)} {curency.hex}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className="big bold txtRight" colSpan={3}>
                    Total de la facture
                  </td>
                  <td className="big bold txtRight">
                    {formatter(totalWithTax)} {curency.hex}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="borderTopColor2 pt1 terms">
            <div className="item">
              {limit_date_paiement && (
                <div>
                  <p className="inbl mb0 small txtRight w40">
                    Date limite de paiement :&nbsp;
                  </p>
                  <p className="inbl mb0 small w60">{limit_date_paiement}</p>
                </div>
              )}
              <p className="inbl small txtRight w40">
                Mode de paiement :&nbsp;{" "}
              </p>
              {paiement_mode && (
                <ul className="inbl pl0 small w60">
                  {paiement_mode.map((mode, i) => (
                    <li key={i}>{mode.kind}</li>
                  ))}
                </ul>
              )}
              {my_company.bank && (
                <div className="borderRib">
                  <div className="row">
                    <p className="col small txtRight w40">Banque :&nbsp;</p>
                    <p className="col small w60">{my_company.bank.name}</p>
                  </div>
                  <div className="row">
                    <p className="col small txtRight w40">IBAN :&nbsp;</p>
                    <p className="col small w60">{my_company.bank.iban}</p>
                  </div>
                  <div className="row">
                    <p className="col small txtRight w40">BIC :&nbsp;</p>
                    <p className="col small w60">{my_company.bank.bic}</p>
                  </div>
                </div>
              )}

              <p className="mt2 smaller">{legal_information}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
