export enum PaymentCategory {
    Bankomat = 'Výber v bankomatu',
    NakladyNaByvanie = 'Náklady na bývanie',
    Cestovanie = 'Cestovanie',
    Supermarket = 'Nákup potravín',
    Sporenie = 'Sporenie',
    Ostatne = 'Ostatné',
    PlatbaPrevodom = 'Platba prevodom'
}

export enum PaymentType {
    Kredity = 'Kredit',
    Debety = 'Debet',
}

export class Payment {
    constructor(
                public id: string,
                public paymentCategory: PaymentCategory,
                public paymentType: PaymentType,
                public dateOfTransaction: string,
                public dateOfMerge: string,
                public place: string,
                public amount: number
                ) {}
}