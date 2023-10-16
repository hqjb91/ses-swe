This is a simple point of sales application for a technical interview assignment.

## Deployed Demo

Test application is deployed at : https://ses-swe.vercel.app/

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## SQL Database Intialisation Scripts

```
CREATE SCHEMA IF NOT EXISTS pos
    AUTHORIZATION postgres;

CREATE SEQUENCE IF NOT EXISTS pos.order_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE pos.order_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS pos.product_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE pos.product_id_seq
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS pos.product
(
    product_id integer NOT NULL DEFAULT nextval('pos.product_id_seq'::regclass),
    price integer NOT NULL,
    product_name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT product_pkey PRIMARY KEY (product_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS pos.product
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS pos."order"
(
    order_id integer NOT NULL DEFAULT nextval('pos.order_id_seq'::regclass),
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT order_pkey PRIMARY KEY (order_id),
    CONSTRAINT fk_order_product FOREIGN KEY (product_id)
        REFERENCES pos.product (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS pos."order"
    OWNER to postgres;
```
