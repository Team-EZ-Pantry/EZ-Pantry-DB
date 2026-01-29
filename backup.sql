--
-- PostgreSQL database dump
--

\restrict hC9lQfpqYu8X98duAvOIx54fc5qsHcgJQscbtSbtfFNaO3ECyMsdrYenJ0pI9v6

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_user; Type: TABLE; Schema: public; Owner: devuser
--

CREATE TABLE public.app_user (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_user OWNER TO devuser;

--
-- Name: app_user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: devuser
--

CREATE SEQUENCE public.app_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.app_user_user_id_seq OWNER TO devuser;

--
-- Name: app_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devuser
--

ALTER SEQUENCE public.app_user_user_id_seq OWNED BY public.app_user.user_id;


--
-- Name: custom_product; Type: TABLE; Schema: public; Owner: devuser
--

CREATE TABLE public.custom_product (
    custom_product_id integer NOT NULL,
    user_id integer,
    barcode text,
    product_name text NOT NULL,
    brand text,
    image_url text,
    categories text[] DEFAULT '{}'::text[],
    allergens text[] DEFAULT '{}'::text[],
    calories_per_100g numeric(10,2),
    protein_per_100g numeric(10,2),
    carbs_per_100g numeric(10,2),
    fat_per_100g numeric(10,2),
    nutrition jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.custom_product OWNER TO devuser;

--
-- Name: custom_product_custom_product_id_seq; Type: SEQUENCE; Schema: public; Owner: devuser
--

CREATE SEQUENCE public.custom_product_custom_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_product_custom_product_id_seq OWNER TO devuser;

--
-- Name: custom_product_custom_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devuser
--

ALTER SEQUENCE public.custom_product_custom_product_id_seq OWNED BY public.custom_product.custom_product_id;


--
-- Name: pantry; Type: TABLE; Schema: public; Owner: devuser
--

CREATE TABLE public.pantry (
    pantry_id integer NOT NULL,
    user_id integer,
    name text NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pantry OWNER TO devuser;

--
-- Name: pantry_pantry_id_seq; Type: SEQUENCE; Schema: public; Owner: devuser
--

CREATE SEQUENCE public.pantry_pantry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pantry_pantry_id_seq OWNER TO devuser;

--
-- Name: pantry_pantry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devuser
--

ALTER SEQUENCE public.pantry_pantry_id_seq OWNED BY public.pantry.pantry_id;


--
-- Name: pantry_product; Type: TABLE; Schema: public; Owner: devuser
--

CREATE TABLE public.pantry_product (
    pantry_id integer NOT NULL,
    product_id integer,
    custom_product_id integer,
    quantity integer,
    expiration_date date,
    added_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pantry_product OWNER TO devuser;

--
-- Name: product; Type: TABLE; Schema: public; Owner: devuser
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    barcode character varying(50) NOT NULL,
    product_name character varying(255),
    brand character varying(255),
    image_url text,
    categories text[],
    allergens text[],
    calories_per_100g numeric(10,2),
    protein_per_100g numeric(10,2),
    carbs_per_100g numeric(10,2),
    fat_per_100g numeric(10,2),
    nutrition jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product OWNER TO devuser;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: devuser
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_product_id_seq OWNER TO devuser;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devuser
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.product.product_id;


--
-- Name: shopping_list; Type: TABLE; Schema: public; Owner: devuser
--

CREATE TABLE public.shopping_list (
    list_id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_complete boolean DEFAULT false
);


ALTER TABLE public.shopping_list OWNER TO devuser;

--
-- Name: shopping_list_item; Type: TABLE; Schema: public; Owner: devuser
--

CREATE TABLE public.shopping_list_item (
    item_id integer NOT NULL,
    list_id integer NOT NULL,
    product_id integer,
    custom_product_id integer,
    text character varying(255),
    quantity integer DEFAULT 1,
    checked boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT shopping_list_item_check CHECK ((((product_id IS NOT NULL) OR (custom_product_id IS NOT NULL) OR (text IS NOT NULL)) AND (NOT ((product_id IS NOT NULL) AND (custom_product_id IS NOT NULL))))),
    CONSTRAINT shopping_list_item_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.shopping_list_item OWNER TO devuser;

--
-- Name: shopping_list_item_item_id_seq; Type: SEQUENCE; Schema: public; Owner: devuser
--

CREATE SEQUENCE public.shopping_list_item_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shopping_list_item_item_id_seq OWNER TO devuser;

--
-- Name: shopping_list_item_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devuser
--

ALTER SEQUENCE public.shopping_list_item_item_id_seq OWNED BY public.shopping_list_item.item_id;


--
-- Name: shopping_list_list_id_seq; Type: SEQUENCE; Schema: public; Owner: devuser
--

CREATE SEQUENCE public.shopping_list_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shopping_list_list_id_seq OWNER TO devuser;

--
-- Name: shopping_list_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devuser
--

ALTER SEQUENCE public.shopping_list_list_id_seq OWNED BY public.shopping_list.list_id;


--
-- Name: app_user user_id; Type: DEFAULT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.app_user ALTER COLUMN user_id SET DEFAULT nextval('public.app_user_user_id_seq'::regclass);


--
-- Name: custom_product custom_product_id; Type: DEFAULT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.custom_product ALTER COLUMN custom_product_id SET DEFAULT nextval('public.custom_product_custom_product_id_seq'::regclass);


--
-- Name: pantry pantry_id; Type: DEFAULT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.pantry ALTER COLUMN pantry_id SET DEFAULT nextval('public.pantry_pantry_id_seq'::regclass);


--
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: shopping_list list_id; Type: DEFAULT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list ALTER COLUMN list_id SET DEFAULT nextval('public.shopping_list_list_id_seq'::regclass);


--
-- Name: shopping_list_item item_id; Type: DEFAULT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list_item ALTER COLUMN item_id SET DEFAULT nextval('public.shopping_list_item_item_id_seq'::regclass);


--
-- Data for Name: app_user; Type: TABLE DATA; Schema: public; Owner: devuser
--

COPY public.app_user (user_id, username, email, password_hash, created_at) FROM stdin;
3	wess	wes@a.com	$2b$10$DxH5ISCfQ4ILEyyVxrjA8epVSK7ztZHI3/8hUN6Id4/F3bNJrsUHu	2025-10-17 21:05:56.399256
1	wes	wesley@fisherusa.org	$2b$10$.JpihNGrISNMubtwWIkW2uVh/k3f143kXrHm0p2BrZ6CZSyxgF6xG	2025-10-13 23:59:07.542604
7	wesss	wes1@gmail.com	$2b$10$hNTLp8wasaoFZZM/k8hJxeKFzmHU58mVnoSIwCsq00fjIlZIZNp4O	2025-12-02 22:41:05.952922
9	test	test@gmail.com	$2b$10$rhTtG/89ELZCc8EtQ40WuO25YGGeZpjExLo5YvbYjlx3ZjqBrA12m	2026-01-25 20:38:36.638948
\.


--
-- Data for Name: custom_product; Type: TABLE DATA; Schema: public; Owner: devuser
--

COPY public.custom_product (custom_product_id, user_id, barcode, product_name, brand, image_url, categories, allergens, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, nutrition, created_at) FROM stdin;
1	1	\N	juice	\N	\N	\N	\N	\N	5.00	1.00	8.00	\N	2025-11-16 21:01:48.582802
2	1	\N	tttt	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-16 21:02:49.515293
3	1	\N	yummy jelly	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-18 21:14:37.587223
4	7	\N	granny apple	\N	\N	\N	\N	\N	5.00	\N	\N	\N	2025-12-02 22:42:10.892524
5	1	\N	chair	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-03 00:06:27.677103
\.


--
-- Data for Name: pantry; Type: TABLE DATA; Schema: public; Owner: devuser
--

COPY public.pantry (pantry_id, user_id, name, is_default, created_at) FROM stdin;
4	1	apple	f	2025-10-20 22:21:10.421945
5	1	wes	f	2025-11-07 21:29:35.824575
6	1	apple	f	2025-11-16 21:01:15.976239
7	7	apple2apples	f	2025-12-02 22:41:15.425
9	9	test	f	2026-01-25 20:38:38.753807
10	1	test	f	2026-01-25 22:54:02.600505
11	1	test	f	2026-01-26 18:17:27.116992
12	1	test	f	2026-01-26 18:25:39.133079
\.


--
-- Data for Name: pantry_product; Type: TABLE DATA; Schema: public; Owner: devuser
--

COPY public.pantry_product (pantry_id, product_id, custom_product_id, quantity, expiration_date, added_at) FROM stdin;
4	8	\N	3	\N	2025-11-06 22:12:09.923225
5	5	\N	29	\N	2025-11-07 21:40:27.290135
6	1	\N	3	\N	2025-11-16 21:29:31.21282
4	9	\N	6	\N	2025-11-06 22:19:55.324724
4	3	\N	1	\N	2025-11-06 22:19:39.606974
6	4	\N	1	\N	2025-11-19 21:20:04.951821
4	15	\N	57	\N	2025-11-06 22:10:24.734053
4	5	\N	5	\N	2025-11-06 19:03:37.749894
5	10	\N	1	\N	2025-11-07 21:42:16.584862
4	12	\N	1	\N	2025-11-06 22:12:02.875966
4	7	\N	11	\N	2025-11-06 22:17:41.899002
4	4	\N	5	\N	2025-11-06 22:19:48.11196
4	16	\N	1	\N	2025-11-06 22:20:04.338412
4	13	\N	1	\N	2025-11-06 22:20:13.174981
4	10	\N	1	\N	2025-11-06 22:20:28.889087
4	11	\N	1	\N	2025-11-06 22:10:12.915129
7	\N	4	1	\N	2025-12-02 22:42:11.072978
7	4987	\N	4	\N	2025-12-02 22:46:08.546493
5	1	\N	13	\N	2025-11-07 21:40:44.696567
4	1	\N	1	\N	2025-11-06 22:12:24.316485
6	5	\N	5	\N	2025-11-19 21:20:19.523383
6	11	\N	1	\N	2025-12-03 21:47:03.266243
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: devuser
--

COPY public.product (product_id, barcode, product_name, brand, image_url, categories, allergens, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, nutrition, created_at) FROM stdin;
1	0041800501694	Natural Concord Grape Spread	Welch's Concord	https://images.openfoodfacts.org/images/products/004/180/050/1694/front_en.11.400.jpg	{en:undefined}	{""}	167.00	\N	44.40	\N	{"fat": 0, "salt": 0.0002075, "fiber": 8, "energy": 126, "iodine": 0, "sodium": 0.000083, "sugars": 0, "glucose": 0, "lactose": 0, "fat_100g": 0, "fat_unit": "g", "fluoride": 0, "fructose": 0, "proteins": 0, "fat_value": 0, "salt_100g": 0.00115, "salt_unit": "g", "fiber_100g": 44.4, "fiber_unit": "g", "nova-group": 4, "salt_value": 0.0002075, "vitamin-pp": 0, "energy-kcal": 30, "energy_100g": 700, "energy_unit": "kcal", "fat_serving": 0, "fiber_value": 8, "iodine_100g": 0, "iodine_unit": "µg", "sodium_100g": 0.000461, "sodium_unit": "g", "sugars_100g": 0, "sugars_unit": "g", "energy_value": 30, "glucose_100g": 0, "glucose_unit": "g", "iodine_value": 0, "lactose_100g": 0, "lactose_unit": "g", "salt_serving": 0.0002075, "sodium_value": 0.000083, "sugars_value": 0, "carbohydrates": 8, "fiber_serving": 8, "fluoride_100g": 0, "fluoride_unit": "µg", "fructose_100g": 0, "fructose_unit": "g", "glucose_value": 0, "lactose_value": 0, "proteins_100g": 0, "proteins_unit": "g", "energy_serving": 126, "fluoride_value": 0, "fructose_value": 0, "iodine_serving": 0, "proteins_value": 0, "sodium_serving": 0.000083, "sugars_serving": 0, "glucose_serving": 0, "lactose_serving": 0, "nova-group_100g": 4, "vitamin-pp_100g": 0, "vitamin-pp_unit": "mg", "energy-kcal_100g": 167, "energy-kcal_unit": "kcal", "fluoride_serving": 0, "fructose_serving": 0, "proteins_serving": 0, "vitamin-pp_value": 0, "energy-kcal_value": 30, "carbohydrates_100g": 44.4, "carbohydrates_unit": "g", "nova-group_serving": 4, "nutrition-score-fr": -4, "vitamin-pp_serving": 0, "carbohydrates_value": 8, "energy-kcal_serving": 30, "carbohydrates_serving": 8, "nutrition-score-fr_100g": -4, "energy-kcal_value_computed": 48, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 60, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 60, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 60, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 60}	2025-10-09 17:45:59.159126
2	0096619620425	Tart Montmorency Cherries	Kirkland	https://images.openfoodfacts.org/images/products/009/661/962/0425/front_en.3.400.jpg	{en:snacks,en:sweet-snacks}	{""}	325.00	\N	77.50	\N	{"fat": 0, "iron": 0.0002, "salt": 0, "fiber": 0, "energy": 544, "sodium": 0, "sugars": 30, "calcium": 0.049, "fat_100g": 0, "fat_unit": "g", "proteins": 0, "fat_value": 0, "iron_100g": 0.0005, "iron_unit": "mg", "potassium": 0.081, "salt_100g": 0, "salt_unit": "g", "fiber_100g": 0, "fiber_unit": "g", "iron_label": "Iron", "iron_value": 0.2, "nova-group": 3, "salt_value": 0, "energy-kcal": 130, "energy_100g": 1360, "energy_unit": "kcal", "fat_serving": 0, "fiber_value": 0, "sodium_100g": 0, "sodium_unit": "g", "sugars_100g": 75, "sugars_unit": "g", "added-sugars": 13, "calcium_100g": 0.123, "calcium_unit": "mg", "energy_value": 130, "iron_serving": 0.0002, "salt_serving": 0, "sodium_value": 0, "sugars_value": 30, "calcium_label": "Calcium", "calcium_value": 49, "carbohydrates": 31, "fiber_serving": 0, "proteins_100g": 0, "proteins_unit": "g", "saturated-fat": 0, "energy_serving": 544, "potassium_100g": 0.202, "potassium_unit": "mg", "proteins_value": 0, "sodium_serving": 0, "sugars_serving": 30, "calcium_serving": 0.049, "nova-group_100g": 3, "potassium_label": "Potassium", "potassium_value": 81, "energy-kcal_100g": 325, "energy-kcal_unit": "kcal", "proteins_serving": 0, "added-sugars_100g": 32.5, "added-sugars_unit": "g", "energy-kcal_value": 130, "potassium_serving": 0.081, "added-sugars_label": "Added sugars", "added-sugars_value": 13, "carbohydrates_100g": 77.5, "carbohydrates_unit": "g", "nova-group_serving": 3, "nutrition-score-fr": 19, "saturated-fat_100g": 0, "saturated-fat_unit": "g", "carbohydrates_value": 31, "energy-kcal_serving": 130, "saturated-fat_value": 0, "added-sugars_serving": 13, "carbohydrates_serving": 31, "saturated-fat_serving": 0, "nutrition-score-fr_100g": 19, "energy-kcal_value_computed": 124, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
3	0028400517737	Original Ruffles	Ruffles	https://images.openfoodfacts.org/images/products/002/840/051/7737/front_en.20.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:snacks,en:cereals-and-potatoes,en:salty-snacks,en:appetizers,en:chips-and-fries,en:crisps,en:potato-crisps}	{en:soybeans}	2040.00	25.50	191.00	128.00	{"fat": 35.7142857142857, "iron": 0.00214285714285714, "salt": 1.25, "zinc": 0, "fiber": 3.57142857142857, "copper": 0, "energy": 2391, "sodium": 0.5, "starch": 0, "sugars": 3.57142857142857, "alcohol": 0, "calcium": 0.0357142857142857, "choline": 0, "caffeine": 0, "fat_100g": 128, "fat_unit": "g", "proteins": 7.14285714285715, "selenium": 0, "fat_value": 35.7142857142857, "iron_100g": 0.00765, "iron_unit": "mg", "magnesium": 0, "manganese": 0, "potassium": 1.25, "salt_100g": 4.46, "salt_unit": "mg", "trans-fat": 0, "vitamin-a": 0, "vitamin-c": 0, "vitamin-d": 0, "vitamin-e": 0, "vitamin-k": 0, "zinc_100g": 0, "zinc_unit": "mg", "fiber_100g": 12.8, "fiber_unit": "g", "iron_value": 2.14285714285714, "nova-group": 3, "phosphorus": 0, "salt_value": 1250, "vitamin-b1": 0, "vitamin-b2": 0, "vitamin-b6": 0, "vitamin-b9": 0, "zinc_value": 0, "cholesterol": 0, "copper_100g": 0, "copper_unit": "mg", "energy-kcal": 571.428571428572, "energy_100g": 8540, "energy_unit": "kcal", "fat_serving": 35.7142857142857, "fiber_value": 3.57142857142857, "sodium_100g": 1.79, "sodium_unit": "mg", "starch_100g": 0, "starch_unit": "g", "sugars_100g": 12.8, "sugars_unit": "g", "vitamin-b12": 0, "added-sugars": 0, "alcohol_100g": 0, "alcohol_unit": "% vol", "calcium_100g": 0.128, "calcium_unit": "mg", "choline_100g": 0, "choline_unit": "mg", "copper_value": 0, "energy_value": 571.428571428572, "iron_serving": 0.00214285714285714, "salt_serving": 1.25, "sodium_value": 500, "starch_value": 0, "sugars_value": 3.57142857142857, "zinc_serving": 0, "alcohol_value": 0, "caffeine_100g": 0, "caffeine_unit": "mg", "calcium_value": 35.7142857142857, "carbohydrates": 53.5714285714286, "choline_value": 0, "fiber_serving": 3.57142857142857, "proteins_100g": 25.5, "proteins_unit": "g", "saturated-fat": 5.35714285714286, "selenium_100g": 0, "selenium_unit": "mcg", "caffeine_value": 0, "copper_serving": 0, "energy_serving": 2391, "magnesium_100g": 0, "magnesium_unit": "mg", "manganese_100g": 0, "manganese_unit": "mg", "potassium_100g": 4.46, "potassium_unit": "mg", "proteins_value": 7.14285714285715, "selenium_value": 0, "sodium_serving": 0.5, "starch_serving": 0, "sugars_serving": 3.57142857142857, "trans-fat_100g": 0, "trans-fat_unit": "g", "vitamin-a_100g": 0, "vitamin-a_unit": "mcg", "vitamin-c_100g": 0, "vitamin-c_unit": "mg", "vitamin-d_100g": 0, "vitamin-d_unit": "mcg", "vitamin-e_100g": 0, "vitamin-e_unit": "mg", "vitamin-k_100g": 0, "vitamin-k_unit": "mcg", "alcohol_serving": 0, "calcium_serving": 0.0357142857142857, "choline_serving": 0, "magnesium_value": 0, "manganese_value": 0, "nova-group_100g": 3, "phosphorus_100g": 0, "phosphorus_unit": "mg", "potassium_value": 1250, "trans-fat_value": 0, "vitamin-a_value": 0, "vitamin-b1_100g": 0, "vitamin-b1_unit": "mg", "vitamin-b2_100g": 0, "vitamin-b2_unit": "mg", "vitamin-b6_100g": 0, "vitamin-b6_unit": "mg", "vitamin-b9_100g": 0, "vitamin-b9_unit": "mcg", "vitamin-c_value": 0, "vitamin-d_value": 0, "vitamin-e_value": 0, "vitamin-k_value": 0, "caffeine_serving": 0, "cholesterol_100g": 0, "cholesterol_unit": "mg", "energy-kcal_100g": 2040, "energy-kcal_unit": "kcal", "phosphorus_value": 0, "proteins_serving": 7.14285714285715, "selenium_serving": 0, "vitamin-b12_100g": 0, "vitamin-b12_unit": "mcg", "vitamin-b1_value": 0, "vitamin-b2_value": 0, "vitamin-b6_value": 0, "vitamin-b9_value": 0, "added-sugars_100g": 0, "added-sugars_unit": "g", "cholesterol_value": 0, "energy-kcal_value": 571.428571428572, "magnesium_serving": 0, "manganese_serving": 0, "potassium_serving": 1.25, "trans-fat_serving": 0, "vitamin-a_serving": 0, "vitamin-b12_value": 0, "vitamin-c_serving": 0, "vitamin-d_serving": 0, "vitamin-e_serving": 0, "vitamin-k_serving": 0, "added-sugars_value": 0, "carbohydrates_100g": 191, "carbohydrates_unit": "g", "nova-group_serving": 3, "nutrition-score-fr": 38, "phosphorus_serving": 0, "saturated-fat_100g": 19.1, "saturated-fat_unit": "g", "vitamin-b1_serving": 0, "vitamin-b2_serving": 0, "vitamin-b6_serving": 0, "vitamin-b9_serving": 0, "carbohydrates_value": 53.5714285714286, "cholesterol_serving": 0, "energy-kcal_serving": 571.428571428572, "monounsaturated-fat": 0, "polyunsaturated-fat": 0, "saturated-fat_value": 5.35714285714286, "vitamin-b12_serving": 0, "added-sugars_serving": 0, "carbohydrates_serving": 53.5714285714286, "saturated-fat_serving": 5.35714285714286, "nutrition-score-fr_100g": 38, "monounsaturated-fat_100g": 0, "monounsaturated-fat_unit": "g", "polyunsaturated-fat_100g": 0, "polyunsaturated-fat_unit": "g", "monounsaturated-fat_value": 0, "polyunsaturated-fat_value": 0, "energy-kcal_value_computed": 571.428571428571, "monounsaturated-fat_serving": 0, "polyunsaturated-fat_serving": 0, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 8.509375, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 1.701875, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 8.509375, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 1.701875}	2025-10-09 17:45:59.159126
4	0037600209571	Chopped Pork and Ham	Hormel	https://images.openfoodfacts.org/images/products/003/760/020/9571/front_en.36.400.jpg	{en:canned-foods,en:meats-and-their-products,en:meats,en:canned-meats}	{en:pork}	292.00	15.00	3.20	24.30	{"fat": 24.3, "salt": 2.4, "fiber": 1.2, "energy": 1209, "sodium": 0.96, "sugars": 1.3, "fat_100g": 24.3, "fat_unit": "g", "proteins": 15, "energy-kj": 1209, "fat_value": 24.3, "salt_100g": 2.4, "salt_unit": "g", "fiber_100g": 1.2, "fiber_unit": "g", "nova-group": 4, "salt_value": 2.4, "energy-kcal": 292, "energy_100g": 1209, "energy_unit": "kJ", "fiber_value": 1.2, "sodium_100g": 0.96, "sodium_unit": "g", "sugars_100g": 1.3, "sugars_unit": "g", "energy_value": 1209, "sodium_value": 0.96, "sugars_value": 1.3, "carbohydrates": 3.2, "proteins_100g": 15, "proteins_unit": "g", "saturated-fat": 9.7, "energy-kj_100g": 1209, "energy-kj_unit": "kJ", "proteins_value": 15, "energy-kj_value": 1209, "nova-group_100g": 4, "energy-kcal_100g": 292, "energy-kcal_unit": "kcal", "energy-kcal_value": 292, "carbohydrates_100g": 3.2, "carbohydrates_unit": "g", "nova-group_serving": 4, "nutrition-score-fr": 23, "saturated-fat_100g": 9.7, "saturated-fat_unit": "g", "carbohydrates_value": 3.2, "saturated-fat_value": 9.7, "nutrition-score-fr_100g": 23, "energy-kj_value_computed": 1218.1, "energy-kcal_value_computed": 293.9, "carbon-footprint-from-meat-or-fish_100g": 14.8, "carbon-footprint-from-meat-or-fish_product": 50.3, "carbon-footprint-from-known-ingredients_100g": 14.8, "carbon-footprint-from-known-ingredients_product": 50.3, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
5	0096619427383	Organic Eggs Grade AA Large	Kirkland Signature	https://images.openfoodfacts.org/images/products/009/661/942/7383/front_en.45.400.jpg	{en:farming-products,en:eggs,en:chicken-eggs}	{en:eggs}	140.00	12.00	\N	10.00	{"fat": 5, "iron": 0.0018, "salt": 0.175, "zinc": 0, "copper": 0, "energy": 293, "sodium": 0.07, "starch": 0, "calcium": 0.03, "choline": 0, "caffeine": 0, "fat_100g": 10, "fat_unit": "g", "proteins": 6, "selenium": 0, "fat_value": 5, "iron_100g": 0.0036, "iron_unit": "mg", "magnesium": 0, "manganese": 0, "potassium": 0.07, "salt_100g": 0.35, "salt_unit": "g", "vitamin-a": 0, "vitamin-c": 0, "vitamin-e": 0, "vitamin-k": 0, "zinc_100g": 0, "zinc_unit": "mg", "iron_label": "Iron", "iron_value": 1.8, "nova-group": 1, "phosphorus": 0, "salt_value": 0.175, "vitamin-b1": 0, "vitamin-b2": 0, "vitamin-b6": 0, "vitamin-b9": 0, "zinc_value": 0, "cholesterol": 0.185, "copper_100g": 0, "copper_unit": "mg", "energy-kcal": 70, "energy_100g": 586, "energy_unit": "kcal", "fat_serving": 5, "sodium_100g": 0.14, "sodium_unit": "g", "starch_100g": 0, "starch_unit": "g", "vitamin-b12": 0, "added-sugars": 0, "calcium_100g": 0.06, "calcium_unit": "g", "choline_100g": 0, "choline_unit": "mg", "copper_value": 0, "energy_value": 70, "iron_serving": 0.0018, "salt_serving": 0.175, "sodium_value": 0.07, "starch_value": 0, "zinc_serving": 0, "caffeine_100g": 0, "caffeine_unit": "mg", "calcium_label": "Calcium", "calcium_value": 0.03, "carbohydrates": 0, "choline_label": "Choline", "choline_value": 0, "proteins_100g": 12, "proteins_unit": "g", "saturated-fat": 1.5, "selenium_100g": 0, "selenium_unit": "mcg", "caffeine_value": 0, "copper_serving": 0, "energy_serving": 293, "magnesium_100g": 0, "magnesium_unit": "mg", "manganese_100g": 0, "manganese_unit": "mg", "potassium_100g": 0.14, "potassium_unit": "g", "proteins_value": 6, "selenium_value": 0, "sodium_serving": 0.07, "starch_serving": 0, "vitamin-a_100g": 0, "vitamin-a_unit": "mcg", "vitamin-c_100g": 0, "vitamin-c_unit": "mg", "vitamin-e_100g": 0, "vitamin-e_unit": "mg", "vitamin-k_100g": 0, "vitamin-k_unit": "mcg", "calcium_serving": 0.03, "choline_serving": 0, "magnesium_value": 0, "manganese_value": 0, "nova-group_100g": 1, "phosphorus_100g": 0, "phosphorus_unit": "mg", "potassium_label": "Potassium", "potassium_value": 0.07, "vitamin-a_value": 0, "vitamin-b1_100g": 0, "vitamin-b1_unit": "mg", "vitamin-b2_100g": 0, "vitamin-b2_unit": "mg", "vitamin-b6_100g": 0, "vitamin-b6_unit": "mg", "vitamin-b9_100g": 0, "vitamin-b9_unit": "mcg", "vitamin-c_value": 0, "vitamin-e_value": 0, "vitamin-k_value": 0, "caffeine_serving": 0, "cholesterol_100g": 0.37, "cholesterol_unit": "g", "energy-kcal_100g": 140, "energy-kcal_unit": "kcal", "phosphorus_value": 0, "proteins_serving": 6, "selenium_serving": 0, "vitamin-b12_100g": 0, "vitamin-b12_unit": "mcg", "vitamin-b1_value": 0, "vitamin-b2_value": 0, "vitamin-b6_value": 0, "vitamin-b9_value": 0, "added-sugars_100g": 0, "added-sugars_unit": "g", "cholesterol_label": "Cholesterol", "cholesterol_value": 0.185, "energy-kcal_value": 70, "magnesium_serving": 0, "manganese_serving": 0, "potassium_serving": 0.07, "vitamin-a_serving": 0, "vitamin-b12_value": 0, "vitamin-c_serving": 0, "vitamin-e_serving": 0, "vitamin-k_serving": 0, "added-sugars_value": 0, "carbohydrates_100g": 0, "carbohydrates_unit": "g", "nova-group_serving": 1, "nutrition-score-fr": 0, "phosphorus_serving": 0, "saturated-fat_100g": 3, "saturated-fat_unit": "g", "vitamin-b1_serving": 0, "vitamin-b2_serving": 0, "vitamin-b6_serving": 0, "vitamin-b9_serving": 0, "carbohydrates_value": 0, "cholesterol_serving": 0.185, "energy-kcal_serving": 70, "saturated-fat_value": 1.5, "vitamin-b12_serving": 0, "added-sugars_serving": 0, "carbohydrates_serving": 0, "saturated-fat_serving": 1.5, "nutrition-score-fr_100g": 0, "energy-kcal_value_computed": 69, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
6	0742365264450	Organic Whole Milk	Horizon Organic	https://images.openfoodfacts.org/images/products/074/236/526/4450/front_en.42.400.jpg	{en:dairies,en:milks,en:cow-milks}	{""}	66.70	3.33	5.42	3.33	{"fat": 8, "iron": 0, "salt": 0.3375, "fiber": 0, "energy": 669, "sodium": 0.135, "sugars": 12, "calcium": 0.31, "fat_100g": 3.33, "fat_unit": "g", "proteins": 8, "fat_value": 8, "iron_100g": 0, "iron_unit": "g", "potassium": 0.41, "salt_100g": 0.141, "salt_unit": "g", "trans-fat": 0, "vitamin-d": 0.0000045, "fiber_100g": 0, "fiber_unit": "g", "iron_value": 0, "nova-group": 1, "phosphorus": 0.24, "salt_value": 0.3375, "vitamin-b2": 0.00009, "cholesterol": 0.035, "energy-kcal": 160, "energy_100g": 279, "energy_unit": "kcal", "fat_serving": 8, "fiber_value": 0, "sodium_100g": 0.0563, "sodium_unit": "g", "sugars_100g": 5, "sugars_unit": "g", "vitamin-b12": 0.0000012, "added-sugars": 0, "calcium_100g": 0.129, "calcium_unit": "g", "energy_value": 160, "iron_serving": 0, "salt_serving": 0.3375, "sodium_value": 0.135, "sugars_value": 12, "calcium_value": 0.31, "carbohydrates": 13, "fiber_serving": 0, "proteins_100g": 3.33, "proteins_unit": "g", "saturated-fat": 5, "energy_serving": 669, "potassium_100g": 0.171, "potassium_unit": "g", "proteins_value": 8, "sodium_serving": 0.135, "sugars_serving": 12, "trans-fat_100g": 0, "trans-fat_unit": "g", "vitamin-d_100g": 0.00000188, "vitamin-d_unit": "g", "calcium_serving": 0.31, "nova-group_100g": 1, "phosphorus_100g": 0.1, "phosphorus_unit": "g", "potassium_value": 0.41, "trans-fat_value": 0, "vitamin-b2_100g": 0.0000375, "vitamin-b2_unit": "g", "vitamin-d_value": 0.0000045, "cholesterol_100g": 0.0146, "cholesterol_unit": "g", "energy-kcal_100g": 66.7, "energy-kcal_unit": "kcal", "phosphorus_value": 0.24, "proteins_serving": 8, "vitamin-b12_100g": 0.0000005, "vitamin-b12_unit": "g", "vitamin-b2_value": 0.00009, "added-sugars_100g": 0, "added-sugars_unit": "g", "cholesterol_value": 0.035, "energy-kcal_value": 160, "potassium_serving": 0.41, "trans-fat_serving": 0, "vitamin-b12_value": 0.0000012, "vitamin-d_serving": 0.0000045, "added-sugars_value": 0, "carbohydrates_100g": 5.42, "carbohydrates_unit": "g", "nova-group_serving": 1, "nutrition-score-fr": 4, "phosphorus_serving": 0.24, "saturated-fat_100g": 2.08, "saturated-fat_unit": "g", "vitamin-b2_serving": 0.00009, "carbohydrates_value": 13, "cholesterol_serving": 0.035, "energy-kcal_serving": 160, "monounsaturated-fat": 2.5, "polyunsaturated-fat": 0, "saturated-fat_value": 5, "vitamin-b12_serving": 0.0000012, "added-sugars_serving": 0, "carbohydrates_serving": 13, "saturated-fat_serving": 5, "nutrition-score-fr_100g": 4, "monounsaturated-fat_100g": 1.04, "monounsaturated-fat_unit": "g", "polyunsaturated-fat_100g": 0, "polyunsaturated-fat_unit": "g", "monounsaturated-fat_value": 2.5, "polyunsaturated-fat_value": 0, "energy-kcal_value_computed": 156, "monounsaturated-fat_serving": 2.5, "polyunsaturated-fat_serving": 0, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
7	0072250037068	Honey Wheat	Nature's Own	https://images.openfoodfacts.org/images/products/007/225/003/7068/front_en.110.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:cereals-and-potatoes,en:cereals-and-their-products,en:breads,en:sliced-breads,en:wholemeal-breads,en:wholemeal-sliced-breads}	{en:gluten,en:soybeans}	269.00	11.50	53.80	1.92	{"fat": 0.5, "iron": 0.0011, "salt": 0.3, "fiber": 0.7, "energy": 293, "sodium": 0.12, "starch": 0, "sugars": 2, "calcium": 0.05, "choline": 0, "fat_100g": 1.92, "fat_unit": "g", "proteins": 3, "fat_value": 0.5, "iron_100g": 0.00423, "iron_unit": "g", "potassium": 0.04, "salt_100g": 1.15, "salt_unit": "g", "fiber_100g": 2.69, "fiber_unit": "g", "iron_value": 0.0011, "nova-group": 4, "salt_value": 0.3, "vitamin-b1": 0.00015, "vitamin-b2": 0.00009, "vitamin-b9": 0.00006, "vitamin-pp": 0.004643, "energy-kcal": 70, "energy_100g": 1130, "energy_unit": "kcal", "fat_serving": 0.5, "fiber_value": 0.7, "sodium_100g": 0.462, "sodium_unit": "g", "starch_100g": 0, "starch_unit": "g", "sugars_100g": 7.69, "sugars_unit": "g", "added-sugars": 2, "calcium_100g": 0.192, "calcium_unit": "g", "choline_100g": 0, "choline_unit": "mg", "energy_value": 70, "iron_serving": 0.0011, "salt_serving": 0.3, "sodium_value": 0.12, "starch_value": 0, "sugars_value": 2, "calcium_value": 0.05, "carbohydrates": 14, "choline_value": 0, "fiber_serving": 0.7, "proteins_100g": 11.5, "proteins_unit": "g", "energy_serving": 293, "potassium_100g": 0.154, "potassium_unit": "g", "proteins_value": 3, "sodium_serving": 0.12, "starch_serving": 0, "sugars_serving": 2, "calcium_serving": 0.05, "choline_serving": 0, "nova-group_100g": 4, "potassium_value": 0.04, "vitamin-b1_100g": 0.000577, "vitamin-b1_unit": "g", "vitamin-b2_100g": 0.000346, "vitamin-b2_unit": "g", "vitamin-b9_100g": 0.000231, "vitamin-b9_unit": "g", "vitamin-pp_100g": 0.0179, "vitamin-pp_unit": "g", "energy-kcal_100g": 269, "energy-kcal_unit": "kcal", "proteins_serving": 3, "vitamin-b1_value": 0.00015, "vitamin-b2_value": 0.00009, "vitamin-b9_value": 0.00006, "vitamin-pp_value": 0.004643, "added-sugars_100g": 7.69, "added-sugars_unit": "g", "energy-kcal_value": 70, "potassium_serving": 0.04, "added-sugars_value": 2, "carbohydrates_100g": 53.8, "carbohydrates_unit": "g", "nova-group_serving": 4, "vitamin-b1_serving": 0.00015, "vitamin-b2_serving": 0.00009, "vitamin-b9_serving": 0.00006, "vitamin-pp_serving": 0.004643, "carbohydrates_value": 14, "energy-kcal_serving": 70, "added-sugars_serving": 2, "carbohydrates_serving": 14, "energy-kcal_value_computed": 73.9, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
8	8076800195057	SPAGHETTI N° 5	Barilla	https://images.openfoodfacts.org/images/products/807/680/019/5057/front_en.3428.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:cereals-and-potatoes,en:cereals-and-their-products,en:pastas,en:cereal-pastas,en:dry-pastas,en:durum-wheat-pasta,en:spaghetti,en:dry-durum-wheat-pasta,en:durum-wheat-spaghetti}	{en:gluten}	359.00	13.00	71.00	2.00	{"fat": 2, "salt": 0.01, "fiber": 3, "energy": 1521, "sodium": 0.004, "starch": 0, "sugars": 3.5, "choline": 0, "fat_100g": 2, "fat_unit": "g", "proteins": 13, "energy-kj": 1521, "fat_value": 2, "salt_100g": 0.01, "salt_unit": "g", "fiber_100g": 3, "fiber_unit": "g", "nova-group": 1, "salt_value": 0.01, "energy-kcal": 359, "energy_100g": 1521, "energy_unit": "kJ", "fat_serving": 1.7, "fiber_value": 3, "sodium_100g": 0.004, "sodium_unit": "g", "starch_100g": 0, "starch_unit": "g", "sugars_100g": 3.5, "sugars_unit": "g", "choline_100g": 0, "choline_unit": "mg", "energy_value": 1521, "salt_serving": 0.0085, "sodium_value": 0.004, "starch_value": 0, "sugars_value": 3.5, "carbohydrates": 71, "choline_value": 0, "fiber_serving": 2.55, "proteins_100g": 13, "proteins_unit": "g", "saturated-fat": 0.5, "energy-kj_100g": 1521, "energy-kj_unit": "kJ", "energy_serving": 1290, "proteins_value": 13, "sodium_serving": 0.0034, "starch_serving": 0, "sugars_serving": 2.98, "choline_serving": 0, "energy-kj_value": 1521, "nova-group_100g": 1, "energy-kcal_100g": 359, "energy-kcal_unit": "kcal", "proteins_serving": 11.1, "energy-kcal_value": 359, "energy-kj_serving": 1290, "carbohydrates_100g": 71, "carbohydrates_unit": "g", "nova-group_serving": 1, "nutrition-score-fr": 0, "saturated-fat_100g": 0.5, "saturated-fat_unit": "g", "carbohydrates_value": 71, "energy-kcal_serving": 305, "saturated-fat_value": 0.5, "carbohydrates_serving": 60.3, "saturated-fat_serving": 0.425, "fruits-vegetables-nuts": 0, "nutrition-score-fr_100g": 0, "energy-kj_value_computed": 1526, "energy-kcal_value_computed": 360, "fruits-vegetables-nuts_100g": 0, "fruits-vegetables-nuts_unit": "g", "fruits-vegetables-nuts_value": 0, "fruits-vegetables-nuts_serving": 0, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
9	7610632002001	Avocado	null	https://images.openfoodfacts.org/images/products/761/063/200/2001/front_de.3.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:fruits-and-vegetables-based-foods,en:fruits-based-foods,en:fruits,en:tropical-fruits,en:avocados}	{""}	\N	\N	\N	\N	{"nova-group": 1, "nova-group_100g": 1, "nova-group_serving": 1, "nutrition-score-fr": 0, "nutrition-score-fr_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 100, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 100, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 100, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 100}	2025-10-09 17:45:59.159126
10	0096619308293	Organic broccoli florets	Kirkland	https://images.openfoodfacts.org/images/products/009/661/930/8293/front_en.3.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:fruits-and-vegetables-based-foods,en:vegetables-based-foods,en:frozen-foods,en:vegetables,en:frozen-plant-based-foods,en:frozen-vegetables,en:broccoli,en:broccoli-florets}	{""}	29.40	3.53	5.88	\N	{"fat": 0, "iron": 0.001003, "salt": 0.0374, "fiber": 3.001, "energy": 105, "sodium": 0.01496, "sugars": 1.003, "calcium": 0.03502, "fat_100g": 0, "fat_unit": "g", "proteins": 3, "fat_value": 0, "iron_100g": 0.00118, "iron_unit": "g", "potassium": 0.21335, "salt_100g": 0.044, "salt_unit": "g", "vitamin-a": 0.000048025, "vitamin-c": 0.05797, "fiber_100g": 3.53, "fiber_unit": "g", "iron_value": 0.001003, "nova-group": 1, "salt_value": 0.0374, "energy-kcal": 24.99, "energy_100g": 124, "energy_unit": "kcal", "fat_serving": 0, "fiber_value": 3.001, "sodium_100g": 0.0176, "sodium_unit": "g", "sugars_100g": 1.18, "sugars_unit": "g", "calcium_100g": 0.0412, "calcium_unit": "g", "energy_value": 24.99, "iron_serving": 0.001003, "salt_serving": 0.0374, "sodium_value": 0.01496, "sugars_value": 1.003, "calcium_value": 0.03502, "carbohydrates": 4.998, "fiber_serving": 3.001, "proteins_100g": 3.53, "proteins_unit": "g", "energy_serving": 105, "potassium_100g": 0.251, "potassium_unit": "g", "proteins_value": 3, "sodium_serving": 0.01496, "sugars_serving": 1.003, "vitamin-a_100g": 0.0000565, "vitamin-a_unit": "g", "vitamin-c_100g": 0.0682, "vitamin-c_unit": "g", "calcium_serving": 0.03502, "nova-group_100g": 1, "potassium_value": 0.21335, "vitamin-a_value": 0.000048025, "vitamin-c_value": 0.05797, "energy-kcal_100g": 29.4, "energy-kcal_unit": "kcal", "proteins_serving": 3, "energy-kcal_value": 24.99, "potassium_serving": 0.21335, "vitamin-a_serving": 0.000048025, "vitamin-c_serving": 0.05797, "carbohydrates_100g": 5.88, "carbohydrates_unit": "g", "nova-group_serving": 1, "nutrition-score-fr": -7, "carbohydrates_value": 4.998, "energy-kcal_serving": 24.99, "carbohydrates_serving": 4.998, "nutrition-score-fr_100g": -7, "energy-kcal_value_computed": 37.994, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 100, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 100, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 100, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 100}	2025-10-09 17:45:59.159126
11	0077013615606	Lightly Breaded Chicken Breast Original Strips	Just Bare	https://images.openfoodfacts.org/images/products/007/701/361/5606/front_en.44.400.jpg	{en:lightly-breaded-chicken-breast-strips}	{en:celery,en:eggs,en:gluten,en:milk,en:soybeans}	183.00	18.30	11.80	6.45	{"fat": 6, "iron": 0.0005, "salt": 1.55, "fiber": 0, "energy": 711, "sodium": 0.62, "starch": 0, "sugars": 2, "calcium": 0.011, "choline": 0, "fat_100g": 6.45, "fat_unit": "g", "proteins": 17, "fat_value": 6, "iron_100g": 0.000538, "iron_unit": "g", "potassium": 0.387, "salt_100g": 1.67, "salt_unit": "g", "trans-fat": 0, "vitamin-d": 0.0000001, "fiber_100g": 0, "fiber_unit": "g", "iron_value": 0.0005, "nova-group": 3, "salt_value": 1.55, "cholesterol": 0.05, "energy-kcal": 170, "energy_100g": 765, "energy_unit": "kcal", "fat_serving": 6, "fiber_value": 0, "sodium_100g": 0.667, "sodium_unit": "g", "starch_100g": 0, "starch_unit": "g", "sugars_100g": 2.15, "sugars_unit": "g", "added-sugars": 2, "calcium_100g": 0.0118, "calcium_unit": "g", "choline_100g": 0, "choline_unit": "mg", "energy_value": 170, "iron_serving": 0.0005, "salt_serving": 1.55, "sodium_value": 0.62, "starch_value": 0, "sugars_value": 2, "calcium_value": 0.011, "carbohydrates": 11, "choline_value": 0, "fiber_serving": 0, "proteins_100g": 18.3, "proteins_unit": "g", "saturated-fat": 1, "energy_serving": 711, "potassium_100g": 0.416, "potassium_unit": "g", "proteins_value": 17, "sodium_serving": 0.62, "starch_serving": 0, "sugars_serving": 2, "trans-fat_100g": 0, "trans-fat_unit": "g", "vitamin-d_100g": 0.000000108, "vitamin-d_unit": "g", "calcium_serving": 0.011, "choline_serving": 0, "nova-group_100g": 3, "potassium_value": 0.387, "trans-fat_value": 0, "vitamin-d_value": 0.0000001, "cholesterol_100g": 0.0538, "cholesterol_unit": "g", "energy-kcal_100g": 183, "energy-kcal_unit": "kcal", "proteins_serving": 17, "added-sugars_100g": 2.15, "added-sugars_unit": "g", "cholesterol_value": 0.05, "energy-kcal_value": 170, "potassium_serving": 0.387, "trans-fat_serving": 0, "vitamin-d_serving": 0.0000001, "added-sugars_value": 2, "carbohydrates_100g": 11.8, "carbohydrates_unit": "g", "nova-group_serving": 3, "nutrition-score-fr": 11, "saturated-fat_100g": 1.08, "saturated-fat_unit": "g", "carbohydrates_value": 11, "cholesterol_serving": 0.05, "energy-kcal_serving": 170, "monounsaturated-fat": 1.6, "polyunsaturated-fat": 3.2, "saturated-fat_value": 1, "added-sugars_serving": 2, "carbohydrates_serving": 11, "saturated-fat_serving": 1, "nutrition-score-fr_100g": 11, "monounsaturated-fat_100g": 1.72, "monounsaturated-fat_unit": "g", "polyunsaturated-fat_100g": 3.44, "polyunsaturated-fat_unit": "g", "monounsaturated-fat_value": 1.6, "polyunsaturated-fat_value": 3.2, "energy-kcal_value_computed": 166, "monounsaturated-fat_serving": 1.6, "polyunsaturated-fat_serving": 3.2, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 2.37, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 1.185, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 2.37, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 1.185}	2025-10-09 17:45:59.159126
12	0033383666020	Baby Carrots	Grimmway Farms	https://images.openfoodfacts.org/images/products/003/338/366/6020/front_en.53.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:fruits-and-vegetables-based-foods,en:vegetables-based-foods,en:vegetables,en:carrots}	{""}	35.30	1.18	8.24	\N	{"fat": 0, "iron": 0.000941176470588235, "salt": 0.1625, "zinc": 0, "fiber": 3, "copper": 0, "energy": 126, "sodium": 0.065, "starch": 0, "sugars": 4, "calcium": 0.03, "choline": 0, "caffeine": 0, "fat_100g": 0, "fat_unit": "g", "proteins": 1, "selenium": 0, "fat_value": 0, "iron_100g": 0.00111, "iron_unit": "mg", "magnesium": 0, "manganese": 0, "potassium": 0.2, "salt_100g": 0.191, "salt_unit": "g", "trans-fat": 0, "vitamin-a": 0.000694117647058824, "vitamin-c": 0.00235294117647059, "vitamin-d": 0, "vitamin-e": 0, "vitamin-k": 0, "zinc_100g": 0, "zinc_unit": "mg", "fiber_100g": 3.53, "fiber_unit": "g", "iron_value": 0.941176470588235, "nova-group": 1, "phosphorus": 0, "salt_value": 0.1625, "vitamin-b1": 0, "vitamin-b2": 0, "vitamin-b6": 0, "vitamin-b9": 0, "zinc_value": 0, "cholesterol": 0, "copper_100g": 0, "copper_unit": "mg", "energy-kcal": 30, "energy_100g": 148, "energy_unit": "kcal", "fat_serving": 0, "fiber_value": 3, "sodium_100g": 0.0765, "sodium_unit": "g", "starch_100g": 0, "starch_unit": "g", "sugars_100g": 4.71, "sugars_unit": "g", "vitamin-b12": 0, "added-sugars": 0, "calcium_100g": 0.0353, "calcium_unit": "g", "choline_100g": 0, "choline_unit": "mg", "copper_value": 0, "energy_value": 30, "iron_serving": 0.000941176470588235, "salt_serving": 0.1625, "sodium_value": 0.065, "starch_value": 0, "sugars_value": 4, "zinc_serving": 0, "caffeine_100g": 0, "caffeine_unit": "mg", "calcium_value": 0.03, "carbohydrates": 7, "choline_value": 0, "fiber_serving": 3, "proteins_100g": 1.18, "proteins_unit": "g", "saturated-fat": 0, "selenium_100g": 0, "selenium_unit": "mcg", "caffeine_value": 0, "copper_serving": 0, "energy_serving": 126, "magnesium_100g": 0, "magnesium_unit": "mg", "manganese_100g": 0, "manganese_unit": "mg", "potassium_100g": 0.235, "potassium_unit": "g", "proteins_value": 1, "selenium_value": 0, "sodium_serving": 0.065, "starch_serving": 0, "sugars_serving": 4, "trans-fat_100g": 0, "trans-fat_unit": "g", "vitamin-a_100g": 0.000817, "vitamin-a_unit": "mcg", "vitamin-c_100g": 0.00277, "vitamin-c_unit": "mg", "vitamin-d_100g": 0, "vitamin-d_unit": "g", "vitamin-e_100g": 0, "vitamin-e_unit": "mg", "vitamin-k_100g": 0, "vitamin-k_unit": "mcg", "calcium_serving": 0.03, "choline_serving": 0, "magnesium_value": 0, "manganese_value": 0, "nova-group_100g": 1, "phosphorus_100g": 0, "phosphorus_unit": "mg", "potassium_value": 0.2, "trans-fat_value": 0, "vitamin-a_value": 694.117647058824, "vitamin-b1_100g": 0, "vitamin-b1_unit": "mg", "vitamin-b2_100g": 0, "vitamin-b2_unit": "mg", "vitamin-b6_100g": 0, "vitamin-b6_unit": "mg", "vitamin-b9_100g": 0, "vitamin-b9_unit": "mcg", "vitamin-c_value": 2.35294117647059, "vitamin-d_value": 0, "vitamin-e_value": 0, "vitamin-k_value": 0, "caffeine_serving": 0, "cholesterol_100g": 0, "cholesterol_unit": "g", "energy-kcal_100g": 35.3, "energy-kcal_unit": "kcal", "phosphorus_value": 0, "proteins_serving": 1, "selenium_serving": 0, "vitamin-b12_100g": 0, "vitamin-b12_unit": "mcg", "vitamin-b1_value": 0, "vitamin-b2_value": 0, "vitamin-b6_value": 0, "vitamin-b9_value": 0, "added-sugars_100g": 0, "added-sugars_unit": "g", "cholesterol_value": 0, "energy-kcal_value": 30, "magnesium_serving": 0, "manganese_serving": 0, "potassium_serving": 0.2, "trans-fat_serving": 0, "vitamin-a_serving": 0.000694117647058824, "vitamin-b12_value": 0, "vitamin-c_serving": 0.00235294117647059, "vitamin-d_serving": 0, "vitamin-e_serving": 0, "vitamin-k_serving": 0, "added-sugars_value": 0, "carbohydrates_100g": 8.24, "carbohydrates_unit": "g", "nova-group_serving": 1, "nutrition-score-fr": -5, "phosphorus_serving": 0, "saturated-fat_100g": 0, "saturated-fat_unit": "g", "vitamin-b1_serving": 0, "vitamin-b2_serving": 0, "vitamin-b6_serving": 0, "vitamin-b9_serving": 0, "carbohydrates_value": 7, "cholesterol_serving": 0, "energy-kcal_serving": 30, "saturated-fat_value": 0, "vitamin-b12_serving": 0, "added-sugars_serving": 0, "carbohydrates_serving": 7, "saturated-fat_serving": 0, "nutrition-score-fr_100g": -5, "energy-kcal_value_computed": 38, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 100, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 100, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 100, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 100}	2025-10-09 17:45:59.159126
13	0024300044311	Mini powdered donuts	Little Debbie, Mckee Foods	https://images.openfoodfacts.org/images/products/002/430/004/4311/front_en.37.400.jpg	{en:snacks,en:sweet-snacks,en:confectioneries,en:biscuits-and-cakes,en:cakes,en:candies,en:doughnuts}	{en:eggs,en:gluten,en:milk,en:soybeans,en:lemon}	434.00	5.66	54.70	22.60	{"fat": 11.9999999979, "iron": 0.0011, "salt": 0.525, "energy": 962, "sodium": 0.21, "sugars": 15, "calcium": 0.02, "fat_100g": 22.6, "fat_unit": "g", "proteins": 3.0000000008, "fat_value": 11.9999999979, "iron_100g": 0.00208, "iron_unit": "g", "potassium": 0.065, "salt_100g": 0.991, "salt_unit": "g", "iron_value": 0.0011, "nova-group": 4, "salt_value": 0.525, "cholesterol": 0.015, "energy-kcal": 229.9999999995, "energy_100g": 1820, "energy_unit": "kcal", "fat_serving": 11.9999999979, "sodium_100g": 0.396, "sodium_unit": "g", "sugars_100g": 28.3, "sugars_unit": "g", "added-sugars": 15, "calcium_100g": 0.0377, "calcium_unit": "g", "energy_value": 230, "iron_serving": 0.0011, "salt_serving": 0.525, "sodium_value": 0.21, "sugars_value": 15, "calcium_value": 0.02, "carbohydrates": 28.9999999989, "proteins_100g": 5.66, "proteins_unit": "g", "saturated-fat": 6, "energy_serving": 962, "potassium_100g": 0.123, "potassium_unit": "g", "proteins_value": 3.0000000008, "sodium_serving": 0.21, "sugars_serving": 15, "calcium_serving": 0.02, "energy-from-fat": 418, "nova-group_100g": 4, "potassium_value": 0.065, "cholesterol_100g": 0.0283, "cholesterol_unit": "g", "energy-kcal_100g": 434, "energy-kcal_unit": "kcal", "proteins_serving": 3.0000000008, "added-sugars_100g": 28.3, "added-sugars_unit": "g", "cholesterol_value": 0.015, "energy-kcal_value": 229.9999999995, "potassium_serving": 0.065, "added-sugars_value": 15, "carbohydrates_100g": 54.7, "carbohydrates_unit": "g", "nova-group_serving": 4, "nutrition-score-fr": 27, "saturated-fat_100g": 11.3, "saturated-fat_unit": "g", "carbohydrates_value": 28.9999999989, "cholesterol_serving": 0.015, "energy-kcal_serving": 229.9999999995, "monounsaturated-fat": 3.5, "polyunsaturated-fat": 1.5, "saturated-fat_value": 6, "added-sugars_serving": 15, "energy-from-fat_100g": 789, "energy-from-fat_unit": "kcal", "carbohydrates_serving": 28.9999999989, "energy-from-fat_value": 100, "saturated-fat_serving": 6, "energy-from-fat_serving": 418, "nutrition-score-fr_100g": 27, "monounsaturated-fat_100g": 6.6, "monounsaturated-fat_unit": "g", "polyunsaturated-fat_100g": 2.83, "polyunsaturated-fat_unit": "g", "monounsaturated-fat_value": 3.5, "polyunsaturated-fat_value": 1.5, "energy-kcal_value_computed": 235.9999999799, "monounsaturated-fat_serving": 3.5, "polyunsaturated-fat_serving": 1.5, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
14	0705599014147	Protein Packed Oatmeal Maple & Brown Sugar	Kodiak	https://images.openfoodfacts.org/images/products/070/559/901/4147/front_en.60.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:breakfasts,en:cereals-and-potatoes,en:cereals-and-their-products,en:breakfast-cereals,en:porridge}	{en:milk}	380.00	24.00	62.00	5.00	{"fat": 2.5, "iron": 0.0023, "salt": 0.425, "fiber": 3, "energy": 795, "sodium": 0.17, "starch": 0, "sugars": 10, "calcium": 0.11, "choline": 0, "fat_100g": 5, "fat_unit": "g", "proteins": 12, "fat_value": 2.5, "iron_100g": 0.0046, "iron_unit": "g", "potassium": 0.14, "salt_100g": 0.85, "salt_unit": "g", "fiber_100g": 6, "fiber_unit": "g", "iron_value": 0.0023, "nova-group": 4, "salt_value": 0.425, "cholesterol": 0.005, "energy-kcal": 190, "energy_100g": 1590, "energy_unit": "kcal", "fat_serving": 2.5, "fiber_value": 3, "sodium_100g": 0.34, "sodium_unit": "g", "starch_100g": 0, "starch_unit": "g", "sugars_100g": 20, "sugars_unit": "g", "added-sugars": 10, "calcium_100g": 0.22, "calcium_unit": "g", "choline_100g": 0, "choline_unit": "mg", "energy_value": 190, "iron_serving": 0.0023, "salt_serving": 0.425, "sodium_value": 0.17, "starch_value": 0, "sugars_value": 10, "calcium_value": 0.11, "carbohydrates": 31, "choline_value": 0, "fiber_serving": 3, "proteins_100g": 24, "proteins_unit": "g", "saturated-fat": 0.5, "energy_serving": 795, "potassium_100g": 0.28, "potassium_unit": "g", "proteins_value": 12, "sodium_serving": 0.17, "starch_serving": 0, "sugars_serving": 10, "calcium_serving": 0.11, "choline_serving": 0, "nova-group_100g": 4, "potassium_value": 0.14, "cholesterol_100g": 0.01, "cholesterol_unit": "g", "energy-kcal_100g": 380, "energy-kcal_unit": "kcal", "proteins_serving": 12, "added-sugars_100g": 20, "added-sugars_unit": "g", "cholesterol_value": 0.005, "energy-kcal_value": 190, "potassium_serving": 0.14, "added-sugars_value": 10, "carbohydrates_100g": 62, "carbohydrates_unit": "g", "nova-group_serving": 4, "nutrition-score-fr": 10, "saturated-fat_100g": 1, "saturated-fat_unit": "g", "carbohydrates_value": 31, "cholesterol_serving": 0.005, "energy-kcal_serving": 190, "saturated-fat_value": 0.5, "added-sugars_serving": 10, "carbohydrates_serving": 31, "saturated-fat_serving": 0.5, "nutrition-score-fr_100g": 10, "energy-kcal_value_computed": 200.5, "carbon-footprint-from-known-ingredients_100g": 30, "carbon-footprint-from-known-ingredients_product": 89.8, "carbon-footprint-from-known-ingredients_serving": 15, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0}	2025-10-09 17:45:59.159126
15	00004067	Zucchini	null	https://images.openfoodfacts.org/images/products/000/000/000/4067/front_en.16.400.jpg	{en:plant-based-foods-and-beverages,en:plant-based-foods,en:fruits-and-vegetables-based-foods,en:vegetables-based-foods,en:vegetables,en:fresh-foods,en:fresh-plant-based-foods,en:fresh-vegetables,en:zucchini,en:fresh-zucchini}	{""}	16.00	1.00	3.00	\N	{"fat": 0, "energy": 67, "fat_100g": 0, "fat_unit": "g", "proteins": 1, "fat_value": 0, "nova-group": 1, "energy-kcal": 16, "energy_100g": 67, "energy_unit": "kcal", "energy_value": 16, "carbohydrates": 3, "proteins_100g": 1, "proteins_unit": "g", "proteins_value": 1, "nova-group_100g": 1, "energy-kcal_100g": 16, "energy-kcal_unit": "kcal", "energy-kcal_value": 16, "carbohydrates_100g": 3, "carbohydrates_unit": "g", "nova-group_serving": 1, "carbohydrates_value": 3, "energy-kcal_value_computed": 16, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 100, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 100, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 100, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 100}	2025-10-09 17:45:59.159126
4980	013764028029	ORGANIC BAGELS, CINNAMON RAISIN REMIX	Avb Corp. - DAVE'S KILLER BREAD	\N	{"Breads & Buns"}	\N	263.00	11.58	51.58	2.63	{"Energy": {"unit": "KCAL", "amount": 263.0}, "Protein": {"unit": "G", "amount": 11.58}, "Iron, Fe": {"unit": "MG", "amount": 1.14}, "Sodium, Na": {"unit": "MG", "amount": 411.0}, "Calcium, Ca": {"unit": "MG", "amount": 42.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 11.58}, "Vitamin A, IU": {"unit": "IU", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 2.63}, "Fiber, total dietary": {"unit": "G", "amount": 3.2}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 51.58}, "Fatty acids, total saturated": {"unit": "G", "amount": 0.0}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 0.0}, "Fatty acids, total monounsaturated": {"unit": "G", "amount": 1.05}, "Fatty acids, total polyunsaturated": {"unit": "G", "amount": 1.05}}	2025-11-09 21:57:45.931741
4981	079200829056	GRAPE, MAUI PUNCH, CHERRY, ORANGE POWDER CANDY, GRAPE, MAUI PUNCH, CHERRY, ORANGE	Ferrara Candy Company - PIXY STIX	\N	{Candy}	\N	375.00	0.00	87.50	0.00	{"Energy": {"unit": "KCAL", "amount": 375.0}, "Protein": {"unit": "G", "amount": 0.0}, "Iron, Fe": {"unit": "MG", "amount": 0.0}, "Sodium, Na": {"unit": "MG", "amount": 0.0}, "Calcium, Ca": {"unit": "MG", "amount": 0.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Potassium, K": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 87.5}, "Total lipid (fat)": {"unit": "G", "amount": 0.0}, "Fiber, total dietary": {"unit": "G", "amount": 0.0}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 87.5}, "Fatty acids, total saturated": {"unit": "G", "amount": 0.0}}	2025-11-09 21:57:45.931741
16	526511	Ground Cumin	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-30 19:59:15.520595
17	028400290432	x	Frito-Lay Company - MATADOR	\N	{"Other Snacks"}	\N	286.00	35.71	17.86	3.57	{"Energy": {"unit": "KCAL", "amount": 286.0}, "Protein": {"unit": "G", "amount": 35.71}, "Iron, Fe": {"unit": "MG", "amount": 3.86}, "Sodium, Na": {"unit": "MG", "amount": 1929.0}, "Calcium, Ca": {"unit": "MG", "amount": 0.0}, "Cholesterol": {"unit": "MG", "amount": 71.0}, "Total Sugars": {"unit": "G", "amount": 17.86}, "Vitamin A, IU": {"unit": "IU", "amount": 714.0}, "Total lipid (fat)": {"unit": "G", "amount": 3.57}, "Fiber, total dietary": {"unit": "G", "amount": 0.9}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 17.86}, "Fatty acids, total saturated": {"unit": "G", "amount": 1.43}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 0.0}}	2025-11-09 21:57:45.931741
4982	602652269318	CHOCOLATE CHIP KIDS CHEWY BARS, CHOCOLATE CHIP	KIND Inc. - KIND	\N	{"Snack, Energy & Granola Bars"}	\N	435.00	4.35	69.57	15.22	{"Energy": {"unit": "KCAL", "amount": 435.0}, "Protein": {"unit": "G", "amount": 4.35}, "Iron, Fe": {"unit": "MG", "amount": 4.35}, "Sodium, Na": {"unit": "MG", "amount": 283.0}, "Calcium, Ca": {"unit": "MG", "amount": 26.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 21.74}, "Sugars, added": {"unit": "G", "amount": 21.7}, "Total lipid (fat)": {"unit": "G", "amount": 15.22}, "Vitamin D (D2 + D3)": {"unit": "UG", "amount": 0.0}, "Fiber, total dietary": {"unit": "G", "amount": 4.3}, "Total sugar alcohols": {"unit": "G", "amount": 0.0}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 69.57}, "Fatty acids, total saturated": {"unit": "G", "amount": 2.17}, "Fatty acids, total monounsaturated": {"unit": "G", "amount": 6.52}, "Fatty acids, total polyunsaturated": {"unit": "G", "amount": 2.17}}	2025-11-09 21:57:45.931741
4983	8809111630227	JUICE DRINK WITH REAL FRUIT PULP	T'BEST	\N	{"Fruit & Vegetable Juice, Nectars & Fruit Drinks"}	\N	55.00	0.00	13.45	0.00	{"Energy": {"unit": "KCAL", "amount": 55.0}, "Protein": {"unit": "G", "amount": 0.0}, "Iron, Fe": {"unit": "MG", "amount": 0.0}, "Sodium, Na": {"unit": "MG", "amount": 2.0}, "Calcium, Ca": {"unit": "MG", "amount": 0.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 13.03}, "Vitamin A, IU": {"unit": "IU", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 0.0}, "Fiber, total dietary": {"unit": "G", "amount": 0.4}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 13.45}, "Fatty acids, total saturated": {"unit": "G", "amount": 0.0}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 27.5}}	2025-11-09 21:57:45.931741
4984	041262281462	POTATO CHIPS, ONION & GRALIC	Wise Foods, Inc. - WISE	\N	{"Chips, Pretzels & Snacks"}	\N	536.00	7.14	50.00	35.71	{"Energy": {"unit": "KCAL", "amount": 536.0}, "Protein": {"unit": "G", "amount": 7.14}, "Iron, Fe": {"unit": "MG", "amount": 0.0}, "Sodium, Na": {"unit": "MG", "amount": 714.0}, "Calcium, Ca": {"unit": "MG", "amount": 0.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 3.57}, "Vitamin A, IU": {"unit": "IU", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 35.71}, "Fiber, total dietary": {"unit": "G", "amount": 3.6}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 50.0}, "Fatty acids, total saturated": {"unit": "G", "amount": 7.14}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 21.4}}	2025-11-09 21:57:45.931741
4985	077593000243	HAYDEN FLOUR MILLS, BLUE BREAD SEMOLINA CRACKERS	Hayden Flour Mills, LLC - HAYDEN FLOUR MILLS	\N	{"Crackers & Biscotti"}	\N	453.00	10.00	70.00	16.40	{"Energy": {"unit": "KCAL", "amount": 453.0}, "Protein": {"unit": "G", "amount": 10.0}, "Iron, Fe": {"unit": "MG", "amount": 2.64}, "Sodium, Na": {"unit": "MG", "amount": 700.0}, "Calcium, Ca": {"unit": "MG", "amount": 93.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Potassium, K": {"unit": "MG", "amount": 283.0}, "Total Sugars": {"unit": "G", "amount": 13.33}, "Total lipid (fat)": {"unit": "G", "amount": 16.4}, "Fiber, total dietary": {"unit": "G", "amount": 7.0}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 70.0}, "Fatty acids, total saturated": {"unit": "G", "amount": 0.0}}	2025-11-09 21:57:45.931741
4986	089669054074	SHIMMER COLOR GUMBALLS	SweetWorks Confections, LLC - SWEETWORKS	\N	{"Chewing Gum & Mints"}	\N	312.00	0.00	75.00	0.00	{"Energy": {"unit": "KCAL", "amount": 312.0}, "Protein": {"unit": "G", "amount": 0.0}, "Iron, Fe": {"unit": "MG", "amount": 0.0}, "Sodium, Na": {"unit": "MG", "amount": 0.0}, "Calcium, Ca": {"unit": "MG", "amount": 1250.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 75.0}, "Vitamin A, IU": {"unit": "IU", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 0.0}, "Fiber, total dietary": {"unit": "G", "amount": 0.0}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 75.0}, "Fatty acids, total saturated": {"unit": "G", "amount": 0.0}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 0.0}}	2025-11-09 21:57:45.931741
4987	00031000200091	BANQUET Original Chicken Fries, 23.2 OZ	Conagra Brands	\N	{Prepared,"Preserved Foods Variety Packs"}	{SOY,WHEAT}	250.00	15.00	15.00	15.00	{"Energy": {"unit": "KCAL", "amount": 250.0}, "Protein": {"unit": "G", "amount": 15.0}, "Iron, Fe": {"unit": "MG", "amount": 0.9}, "Sodium, Na": {"unit": "MG", "amount": 488.0}, "Calcium, Ca": {"unit": "MG", "amount": 0.0}, "Cholesterol": {"unit": "MG", "amount": 44.0}, "Potassium, K": {"unit": "MG", "amount": 212.0}, "Total Sugars": {"unit": "G", "amount": 1.25}, "Vitamin A, IU": {"unit": "IU", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 15.0}, "Fiber, total dietary": {"unit": "G", "amount": 1.2}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 15.0}, "Fatty acids, total saturated": {"unit": "G", "amount": 2.5}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 0.0}, "Fatty acids, total monounsaturated": {"unit": "G", "amount": 5.0}, "Fatty acids, total polyunsaturated": {"unit": "G", "amount": 6.25}}	2025-11-09 21:57:45.931741
4988	072830033596	EXTRA SHARP CHEDDAR CHEESE, EXTRA SHARP CHEDDAR	Tillamook County Creamery Association - TILLAMOOK - MORNING STAR	\N	{Cheese}	\N	429.00	21.43	3.57	35.71	{"Energy": {"unit": "KCAL", "amount": 429.0}, "Protein": {"unit": "G", "amount": 21.43}, "Iron, Fe": {"unit": "MG", "amount": 1.29}, "Sodium, Na": {"unit": "MG", "amount": 714.0}, "Calcium, Ca": {"unit": "MG", "amount": 536.0}, "Cholesterol": {"unit": "MG", "amount": 107.0}, "Potassium, K": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 35.71}, "Fiber, total dietary": {"unit": "G", "amount": 0.0}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 3.57}, "Fatty acids, total saturated": {"unit": "G", "amount": 21.43}, "Vitamin D (D2 + D3), International Units": {"unit": "IU", "amount": 0.0}}	2025-11-09 21:57:45.931741
4989	077900806179	MEAT LOVERS POTATOES, SAUSAGE, CAGE FREE EGGS, CHEDDAR CHEESE & BACON BREAKFAST BOWL, MEAT LOVERS	The Hillshire Brands Company - JIMMY DEAN	\N	{"Frozen Breakfast Sandwiches, Biscuits & Meals"}	\N	242.00	11.62	8.08	18.69	{"Energy": {"unit": "KCAL", "amount": 242.0}, "Protein": {"unit": "G", "amount": 11.62}, "Iron, Fe": {"unit": "MG", "amount": 1.01}, "Sodium, Na": {"unit": "MG", "amount": 596.0}, "Calcium, Ca": {"unit": "MG", "amount": 126.0}, "Cholesterol": {"unit": "MG", "amount": 106.0}, "Potassium, K": {"unit": "MG", "amount": 242.0}, "Total Sugars": {"unit": "G", "amount": 0.51}, "Sugars, added": {"unit": "G", "amount": 0.5}, "Total lipid (fat)": {"unit": "G", "amount": 18.69}, "Vitamin D (D2 + D3)": {"unit": "UG", "amount": 0.0}, "Fiber, total dietary": {"unit": "G", "amount": 1.0}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 8.08}, "Fatty acids, total saturated": {"unit": "G", "amount": 7.58}}	2025-11-09 21:57:45.931741
4990	049022845855	PIZZA, PEPPERONI	Walgreens Co. - NICE!	\N	{Pizza}	\N	247.00	10.27	23.97	12.33	{"Energy": {"unit": "KCAL", "amount": 247.0}, "Protein": {"unit": "G", "amount": 10.27}, "Iron, Fe": {"unit": "MG", "amount": 0.74}, "Sodium, Na": {"unit": "MG", "amount": 616.0}, "Calcium, Ca": {"unit": "MG", "amount": 205.0}, "Cholesterol": {"unit": "MG", "amount": 31.0}, "Total Sugars": {"unit": "G", "amount": 2.74}, "Vitamin A, IU": {"unit": "IU", "amount": 342.0}, "Total lipid (fat)": {"unit": "G", "amount": 12.33}, "Fiber, total dietary": {"unit": "G", "amount": 1.4}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 23.97}, "Fatty acids, total saturated": {"unit": "G", "amount": 5.48}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 6.2}}	2025-11-09 21:57:45.931741
4991	853218000221	CHERRY POMEGRANATE FLAVORED ELECTROLYTE DRINK MIX, CHERRY POMEGRANATE	Ultima Health Products, Inc. - ULTIMA REPLENISHER	\N	{"Powdered Drinks"}	\N	0.00	0.00	0.00	0.00	{"Energy": {"unit": "KCAL", "amount": 0.0}, "Protein": {"unit": "G", "amount": 0.0}, "Zinc, Zn": {"unit": "MG", "amount": 35.29}, "Sodium, Na": {"unit": "MG", "amount": 1618.0}, "Calcium, Ca": {"unit": "MG", "amount": 1765.0}, "Potassium, K": {"unit": "MG", "amount": 6176.0}, "Total Sugars": {"unit": "G", "amount": 0.0}, "Magnesium, Mg": {"unit": "MG", "amount": 2941.0}, "Manganese, Mn": {"unit": "MG", "amount": 5.0}, "Phosphorus, P": {"unit": "MG", "amount": 1765.0}, "Total lipid (fat)": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 0.0}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 1941.2}}	2025-11-09 21:57:45.931741
4992	490710650112	SIMPLY BALANCED, ORGANIC SPINACH CORN TORTILLA CHIPS	SIMPLY BALANCED	\N	{"Chips, Pretzels & Snacks"}	\N	500.00	7.14	53.57	28.57	{"Energy": {"unit": "KCAL", "amount": 500.0}, "Protein": {"unit": "G", "amount": 7.14}, "Iron, Fe": {"unit": "MG", "amount": 2.57}, "Sodium, Na": {"unit": "MG", "amount": 411.0}, "Calcium, Ca": {"unit": "MG", "amount": 143.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 0.0}, "Vitamin A, IU": {"unit": "IU", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 28.57}, "Fiber, total dietary": {"unit": "G", "amount": 7.1}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 53.57}, "Fatty acids, total saturated": {"unit": "G", "amount": 1.79}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 0.0}}	2025-11-09 21:57:45.931741
4993	00054100977243	Open Pit Blue Label Original Barbecue Sauce, 156 oz.	Conagra Brands, Inc - Open Pit	\N	{Sauces,Spreads,Dips,Condiments}	{SOY.}	118.00	0.00	26.47	0.00	{"Energy": {"unit": "KCAL", "amount": 118.0}, "Protein": {"unit": "G", "amount": 0.0}, "Iron, Fe": {"unit": "MG", "amount": 0.0}, "Vitamin A": {"unit": "UG", "amount": 0.0}, "Sodium, Na": {"unit": "MG", "amount": 1147.0}, "Calcium, Ca": {"unit": "MG", "amount": 0.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Potassium, K": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 23.53}, "Sugars, added": {"unit": "G", "amount": 23.5}, "Total lipid (fat)": {"unit": "G", "amount": 0.0}, "Vitamin D (D2 + D3)": {"unit": "UG", "amount": 0.0}, "Fiber, total dietary": {"unit": "G", "amount": 0.0}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 26.47}, "Fatty acids, total saturated": {"unit": "G", "amount": 0.0}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 0.0}, "Fatty acids, total monounsaturated": {"unit": "G", "amount": 0.0}, "Fatty acids, total polyunsaturated": {"unit": "G", "amount": 0.0}}	2025-11-09 21:57:45.931741
4994	027182558839	LEAN 85% FAT 15% GROUND BEEF ROUND	Ibp, Inc.	\N	{"Other Meats"}	\N	214.00	18.75	0.00	15.18	{"Energy": {"unit": "KCAL", "amount": 214.0}, "Protein": {"unit": "G", "amount": 18.75}, "Iron, Fe": {"unit": "MG", "amount": 2.41}, "Sodium, Na": {"unit": "MG", "amount": 67.0}, "Calcium, Ca": {"unit": "MG", "amount": 0.0}, "Cholesterol": {"unit": "MG", "amount": 67.0}, "Total Sugars": {"unit": "G", "amount": 0.0}, "Vitamin A, IU": {"unit": "IU", "amount": 0.0}, "Total lipid (fat)": {"unit": "G", "amount": 15.18}, "Fiber, total dietary": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 0.0}, "Fatty acids, total saturated": {"unit": "G", "amount": 5.36}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 0.0}}	2025-11-09 21:57:45.931741
4995	078742010731	STRAWBERRY WATERMELON FLAVOR DRINK ENHANCER, STRAWBERRY WATERMELON	Wal-Mart Stores, Inc. - GREAT VALUE	\N	{"Liquid Water Enhancer"}	\N	0.00	0.00	33.33	0.00	{"Energy": {"unit": "KCAL", "amount": 0.0}, "Niacin": {"unit": "MG", "amount": 100.0}, "Protein": {"unit": "G", "amount": 0.0}, "Sodium, Na": {"unit": "MG", "amount": 0.0}, "Vitamin B-6": {"unit": "MG", "amount": 10.0}, "Total Sugars": {"unit": "G", "amount": 0.0}, "Vitamin B-12": {"unit": "UG", "amount": 30.0}, "Total lipid (fat)": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 33.33}}	2025-11-09 21:57:45.931741
4996	841749117495	POPCORN, TOASTED CINNAMON CRUNCH	Dylans Candy Bar - DYLAN'S CANDY BAR	\N	{"Popcorn, Peanuts, Seeds & Related Snacks"}	\N	464.00	3.57	78.57	14.29	{"Energy": {"unit": "KCAL", "amount": 464.0}, "Protein": {"unit": "G", "amount": 3.57}, "Iron, Fe": {"unit": "MG", "amount": 3.86}, "Sodium, Na": {"unit": "MG", "amount": 268.0}, "Calcium, Ca": {"unit": "MG", "amount": 71.0}, "Cholesterol": {"unit": "MG", "amount": 0.0}, "Total Sugars": {"unit": "G", "amount": 57.14}, "Vitamin A, IU": {"unit": "IU", "amount": 1429.0}, "Total lipid (fat)": {"unit": "G", "amount": 14.29}, "Fiber, total dietary": {"unit": "G", "amount": 3.6}, "Fatty acids, total trans": {"unit": "G", "amount": 0.0}, "Carbohydrate, by difference": {"unit": "G", "amount": 78.57}, "Fatty acids, total saturated": {"unit": "G", "amount": 10.71}, "Vitamin C, total ascorbic acid": {"unit": "MG", "amount": 12.9}}	2025-11-09 21:57:45.931741
\.


--
-- Data for Name: shopping_list; Type: TABLE DATA; Schema: public; Owner: devuser
--

COPY public.shopping_list (list_id, user_id, name, created_at, updated_at, is_complete) FROM stdin;
1	1	test	2025-10-24 14:17:41.373786	2025-10-24 20:45:46.129087	f
2	1	pan	2025-11-11 04:07:25.222359	2025-11-11 04:07:25.222359	f
3	1	uno	2026-01-20 23:26:36.898802	2026-01-20 23:26:36.898802	f
4	1	Alpine	2026-01-20 23:29:02.023064	2026-01-20 23:29:02.023064	f
\.


--
-- Data for Name: shopping_list_item; Type: TABLE DATA; Schema: public; Owner: devuser
--

COPY public.shopping_list_item (item_id, list_id, product_id, custom_product_id, text, quantity, checked, created_at, updated_at) FROM stdin;
1	1	1	\N	\N	5	f	2025-11-11 04:15:38.928084	2025-11-11 04:15:38.928084
2	1	1	\N	\N	5	f	2025-11-11 04:17:09.976987	2025-11-11 04:17:09.976987
3	1	1	\N	\N	5	f	2025-11-12 19:45:51.994364	2025-11-12 19:45:51.994364
4	1	2	\N	\N	5	f	2025-11-12 19:50:17.484404	2025-11-12 19:50:17.484404
\.


--
-- Name: app_user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devuser
--

SELECT pg_catalog.setval('public.app_user_user_id_seq', 9, true);


--
-- Name: custom_product_custom_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devuser
--

SELECT pg_catalog.setval('public.custom_product_custom_product_id_seq', 5, true);


--
-- Name: pantry_pantry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devuser
--

SELECT pg_catalog.setval('public.pantry_pantry_id_seq', 12, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devuser
--

SELECT pg_catalog.setval('public.products_product_id_seq', 4996, true);


--
-- Name: shopping_list_item_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devuser
--

SELECT pg_catalog.setval('public.shopping_list_item_item_id_seq', 4, true);


--
-- Name: shopping_list_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devuser
--

SELECT pg_catalog.setval('public.shopping_list_list_id_seq', 4, true);


--
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (user_id);


--
-- Name: app_user app_user_username_key; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_username_key UNIQUE (username);


--
-- Name: custom_product custom_product_barcode_key; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.custom_product
    ADD CONSTRAINT custom_product_barcode_key UNIQUE (barcode);


--
-- Name: custom_product custom_product_pkey; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.custom_product
    ADD CONSTRAINT custom_product_pkey PRIMARY KEY (custom_product_id);


--
-- Name: pantry pantry_pkey; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.pantry
    ADD CONSTRAINT pantry_pkey PRIMARY KEY (pantry_id);


--
-- Name: product products_barcode_key; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT products_barcode_key UNIQUE (barcode);


--
-- Name: product products_pkey; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: shopping_list_item shopping_list_item_pkey; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list_item
    ADD CONSTRAINT shopping_list_item_pkey PRIMARY KEY (item_id);


--
-- Name: shopping_list shopping_list_pkey; Type: CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list
    ADD CONSTRAINT shopping_list_pkey PRIMARY KEY (list_id);


--
-- Name: unique_lower_email; Type: INDEX; Schema: public; Owner: devuser
--

CREATE UNIQUE INDEX unique_lower_email ON public.app_user USING btree (lower((email)::text));


--
-- Name: custom_product custom_product_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.custom_product
    ADD CONSTRAINT custom_product_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(user_id) ON DELETE CASCADE;


--
-- Name: pantry_product pantry_product_custom_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.pantry_product
    ADD CONSTRAINT pantry_product_custom_product_id_fkey FOREIGN KEY (custom_product_id) REFERENCES public.custom_product(custom_product_id) ON DELETE CASCADE;


--
-- Name: pantry_product pantry_product_pantry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.pantry_product
    ADD CONSTRAINT pantry_product_pantry_id_fkey FOREIGN KEY (pantry_id) REFERENCES public.pantry(pantry_id) ON DELETE CASCADE;


--
-- Name: pantry_product pantry_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.pantry_product
    ADD CONSTRAINT pantry_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: pantry pantry_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.pantry
    ADD CONSTRAINT pantry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(user_id) ON DELETE CASCADE;


--
-- Name: shopping_list_item shopping_list_item_custom_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list_item
    ADD CONSTRAINT shopping_list_item_custom_product_id_fkey FOREIGN KEY (custom_product_id) REFERENCES public.custom_product(custom_product_id) ON DELETE CASCADE;


--
-- Name: shopping_list_item shopping_list_item_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list_item
    ADD CONSTRAINT shopping_list_item_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.shopping_list(list_id) ON DELETE CASCADE;


--
-- Name: shopping_list_item shopping_list_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list_item
    ADD CONSTRAINT shopping_list_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: shopping_list shopping_list_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devuser
--

ALTER TABLE ONLY public.shopping_list
    ADD CONSTRAINT shopping_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict hC9lQfpqYu8X98duAvOIx54fc5qsHcgJQscbtSbtfFNaO3ECyMsdrYenJ0pI9v6

