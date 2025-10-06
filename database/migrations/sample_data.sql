-- Inserts 15 rows of sample data into the product table. Items include Concord Grape Spread to Zucchini.

INSERT INTO product (
    barcode,
    product_name,
    brand,
    image_url,
    categories,
    allergens,
    calories_per_100g,
    protein_per_100g,
    carbs_per_100g,
    fat_per_100g,
    nutrition,
	created_at
) VALUES (
    '0041800501694',
    'Natural Concord Grape Spread',
    'Welch''s Concord',
    'https://images.openfoodfacts.org/images/products/004/180/050/1694/front_en.11.400.jpg',
    ARRAY['en:undefined'],
    ARRAY[''],
    167,
    NULL,
    44.4,
    NULL,
    '{"carbohydrates":8,"carbohydrates_100g":44.4,"carbohydrates_serving":8,"carbohydrates_unit":"g","carbohydrates_value":8,"energy":126,"energy-kcal":30,"energy-kcal_100g":167,"energy-kcal_serving":30,"energy-kcal_unit":"kcal","energy-kcal_value":30,"energy-kcal_value_computed":48,"energy_100g":700,"energy_serving":126,"energy_unit":"kcal","energy_value":30,"fat":0,"fat_100g":0,"fat_serving":0,"fat_unit":"g","fat_value":0,"fiber":8,"fiber_100g":44.4,"fiber_serving":8,"fiber_unit":"g","fiber_value":8,"fluoride":0,"fluoride_100g":0,"fluoride_serving":0,"fluoride_unit":"µg","fluoride_value":0,"fructose":0,"fructose_100g":0,"fructose_serving":0,"fructose_unit":"g","fructose_value":0,"fruits-vegetables-legumes-estimate-from-ingredients_100g":60,"fruits-vegetables-legumes-estimate-from-ingredients_serving":60,"fruits-vegetables-nuts-estimate-from-ingredients_100g":60,"fruits-vegetables-nuts-estimate-from-ingredients_serving":60,"glucose":0,"glucose_100g":0,"glucose_serving":0,"glucose_unit":"g","glucose_value":0,"iodine":0,"iodine_100g":0,"iodine_serving":0,"iodine_unit":"µg","iodine_value":0,"lactose":0,"lactose_100g":0,"lactose_serving":0,"lactose_unit":"g","lactose_value":0,"nova-group":4,"nova-group_100g":4,"nova-group_serving":4,"nutrition-score-fr":-4,"nutrition-score-fr_100g":-4,"proteins":0,"proteins_100g":0,"proteins_serving":0,"proteins_unit":"g","proteins_value":0,"salt":0.0002075,"salt_100g":0.00115,"salt_serving":0.0002075,"salt_unit":"g","salt_value":0.0002075,"sodium":0.000083,"sodium_100g":0.000461,"sodium_serving":0.000083,"sodium_unit":"g","sodium_value":0.000083,"sugars":0,"sugars_100g":0,"sugars_serving":0,"sugars_unit":"g","sugars_value":0,"vitamin-pp":0,"vitamin-pp_100g":0,"vitamin-pp_serving":0,"vitamin-pp_unit":"mg","vitamin-pp_value":0}'::jsonb,
    NOW()
),

(
    '0096619620425',
    'Tart Montmorency Cherries',
    'Kirkland',
    'https://images.openfoodfacts.org/images/products/009/661/962/0425/front_en.3.400.jpg',
    ARRAY['en:snacks','en:sweet-snacks'],
    ARRAY[''],
    325,
    NULL,
    77.5,
    NULL,
    '{"added-sugars":13,"added-sugars_100g":32.5,"added-sugars_label":"Added sugars","added-sugars_serving":13,"added-sugars_unit":"g","added-sugars_value":13,"calcium":0.049,"calcium_100g":0.123,"calcium_label":"Calcium","calcium_serving":0.049,"calcium_unit":"mg","calcium_value":49,"carbohydrates":31,"carbohydrates_100g":77.5,"carbohydrates_serving":31,"carbohydrates_unit":"g","carbohydrates_value":31,"energy":544,"energy-kcal":130,"energy-kcal_100g":325,"energy-kcal_serving":130,"energy-kcal_unit":"kcal","energy-kcal_value":130,"energy-kcal_value_computed":124,"energy_100g":1360,"energy_serving":544,"energy_unit":"kcal","energy_value":130,"fat":0,"fat_100g":0,"fat_serving":0,"fat_unit":"g","fat_value":0,"fiber":0,"fiber_100g":0,"fiber_serving":0,"fiber_unit":"g","fiber_value":0,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"iron":0.0002,"iron_100g":0.0005,"iron_label":"Iron","iron_serving":0.0002,"iron_unit":"mg","iron_value":0.2,"nova-group":3,"nova-group_100g":3,"nova-group_serving":3,"nutrition-score-fr":19,"nutrition-score-fr_100g":19,"potassium":0.081,"potassium_100g":0.202,"potassium_label":"Potassium","potassium_serving":0.081,"potassium_unit":"mg","potassium_value":81,"proteins":0,"proteins_100g":0,"proteins_serving":0,"proteins_unit":"g","proteins_value":0,"salt":0,"salt_100g":0,"salt_serving":0,"salt_unit":"g","salt_value":0,"saturated-fat":0,"saturated-fat_100g":0,"saturated-fat_serving":0,"saturated-fat_unit":"g","saturated-fat_value":0,"sodium":0,"sodium_100g":0,"sodium_serving":0,"sodium_unit":"g","sodium_value":0,"sugars":30,"sugars_100g":75,"sugars_serving":30,"sugars_unit":"g","sugars_value":30}'::jsonb,
	NOW()
),

(
    '0028400517737',
    'Original Ruffles',
    'Ruffles',
    'https://images.openfoodfacts.org/images/products/002/840/051/7737/front_en.20.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:snacks','en:cereals-and-potatoes','en:salty-snacks','en:appetizers','en:chips-and-fries','en:crisps','en:potato-crisps'],
    ARRAY['en:soybeans'],
    2040,
    25.5,
    191,
    128,
    '{"added-sugars":0,"added-sugars_100g":0,"added-sugars_serving":0,"added-sugars_unit":"g","added-sugars_value":0,"alcohol":0,"alcohol_100g":0,"alcohol_serving":0,"alcohol_unit":"% vol","alcohol_value":0,"caffeine":0,"caffeine_100g":0,"caffeine_serving":0,"caffeine_unit":"mg","caffeine_value":0,"calcium":0.0357142857142857,"calcium_100g":0.128,"calcium_serving":0.0357142857142857,"calcium_unit":"mg","calcium_value":35.7142857142857,"carbohydrates":53.5714285714286,"carbohydrates_100g":191,"carbohydrates_serving":53.5714285714286,"carbohydrates_unit":"g","carbohydrates_value":53.5714285714286,"cholesterol":0,"cholesterol_100g":0,"cholesterol_serving":0,"cholesterol_unit":"mg","cholesterol_value":0,"choline":0,"choline_100g":0,"choline_serving":0,"choline_unit":"mg","choline_value":0,"copper":0,"copper_100g":0,"copper_serving":0,"copper_unit":"mg","copper_value":0,"energy":2391,"energy-kcal":571.428571428572,"energy-kcal_100g":2040,"energy-kcal_serving":571.428571428572,"energy-kcal_unit":"kcal","energy-kcal_value":571.428571428572,"energy-kcal_value_computed":571.428571428571,"energy_100g":8540,"energy_serving":2391,"energy_unit":"kcal","energy_value":571.428571428572,"fat":35.7142857142857,"fat_100g":128,"fat_serving":35.7142857142857,"fat_unit":"g","fat_value":35.7142857142857,"fiber":3.57142857142857,"fiber_100g":12.8,"fiber_serving":3.57142857142857,"fiber_unit":"g","fiber_value":3.57142857142857,"fruits-vegetables-legumes-estimate-from-ingredients_100g":1.701875,"fruits-vegetables-legumes-estimate-from-ingredients_serving":1.701875,"fruits-vegetables-nuts-estimate-from-ingredients_100g":8.509375,"fruits-vegetables-nuts-estimate-from-ingredients_serving":8.509375,"iron":0.00214285714285714,"iron_100g":0.00765,"iron_serving":0.00214285714285714,"iron_unit":"mg","iron_value":2.14285714285714,"magnesium":0,"magnesium_100g":0,"magnesium_serving":0,"magnesium_unit":"mg","magnesium_value":0,"manganese":0,"manganese_100g":0,"manganese_serving":0,"manganese_unit":"mg","manganese_value":0,"monounsaturated-fat":0,"monounsaturated-fat_100g":0,"monounsaturated-fat_serving":0,"monounsaturated-fat_unit":"g","monounsaturated-fat_value":0,"nova-group":3,"nova-group_100g":3,"nova-group_serving":3,"nutrition-score-fr":38,"nutrition-score-fr_100g":38,"phosphorus":0,"phosphorus_100g":0,"phosphorus_serving":0,"phosphorus_unit":"mg","phosphorus_value":0,"polyunsaturated-fat":0,"polyunsaturated-fat_100g":0,"polyunsaturated-fat_serving":0,"polyunsaturated-fat_unit":"g","polyunsaturated-fat_value":0,"potassium":1.25,"potassium_100g":4.46,"potassium_serving":1.25,"potassium_unit":"mg","potassium_value":1250,"proteins":7.14285714285715,"proteins_100g":25.5,"proteins_serving":7.14285714285715,"proteins_unit":"g","proteins_value":7.14285714285715,"salt":1.25,"salt_100g":4.46,"salt_serving":1.25,"salt_unit":"mg","salt_value":1250,"saturated-fat":5.35714285714286,"saturated-fat_100g":19.1,"saturated-fat_serving":5.35714285714286,"saturated-fat_unit":"g","saturated-fat_value":5.35714285714286,"selenium":0,"selenium_100g":0,"selenium_serving":0,"selenium_unit":"mcg","selenium_value":0,"sodium":0.5,"sodium_100g":1.79,"sodium_serving":0.5,"sodium_unit":"mg","sodium_value":500,"starch":0,"starch_100g":0,"starch_serving":0,"starch_unit":"g","starch_value":0,"sugars":3.57142857142857,"sugars_100g":12.8,"sugars_serving":3.57142857142857,"sugars_unit":"g","sugars_value":3.57142857142857,"trans-fat":0,"trans-fat_100g":0,"trans-fat_serving":0,"trans-fat_unit":"g","trans-fat_value":0,"vitamin-a":0,"vitamin-a_100g":0,"vitamin-a_serving":0,"vitamin-a_unit":"mcg","vitamin-a_value":0,"vitamin-b1":0,"vitamin-b12":0,"vitamin-b12_100g":0,"vitamin-b12_serving":0,"vitamin-b12_unit":"mcg","vitamin-b12_value":0,"vitamin-b1_100g":0,"vitamin-b1_serving":0,"vitamin-b1_unit":"mg","vitamin-b1_value":0,"vitamin-b2":0,"vitamin-b2_100g":0,"vitamin-b2_serving":0,"vitamin-b2_unit":"mg","vitamin-b2_value":0,"vitamin-b6":0,"vitamin-b6_100g":0,"vitamin-b6_serving":0,"vitamin-b6_unit":"mg","vitamin-b6_value":0,"vitamin-b9":0,"vitamin-b9_100g":0,"vitamin-b9_serving":0,"vitamin-b9_unit":"mcg","vitamin-b9_value":0,"vitamin-c":0,"vitamin-c_100g":0,"vitamin-c_serving":0,"vitamin-c_unit":"mg","vitamin-c_value":0,"vitamin-d":0,"vitamin-d_100g":0,"vitamin-d_serving":0,"vitamin-d_unit":"mcg","vitamin-d_value":0,"vitamin-e":0,"vitamin-e_100g":0,"vitamin-e_serving":0,"vitamin-e_unit":"mg","vitamin-e_value":0,"vitamin-k":0,"vitamin-k_100g":0,"vitamin-k_serving":0,"vitamin-k_unit":"mcg","vitamin-k_value":0,"zinc":0,"zinc_100g":0,"zinc_serving":0,"zinc_unit":"mg","zinc_value":0}'::jsonb,
	NOW()
),

(
    '0037600209571',
    'Chopped Pork and Ham',
    'Hormel',
    'https://images.openfoodfacts.org/images/products/003/760/020/9571/front_en.36.400.jpg',
    ARRAY['en:canned-foods','en:meats-and-their-products','en:meats','en:canned-meats'],
    ARRAY['en:pork'],
    292,
    15,
    3.2,
    24.3,
    '{"carbohydrates":3.2,"carbohydrates_100g":3.2,"carbohydrates_unit":"g","carbohydrates_value":3.2,"carbon-footprint-from-known-ingredients_100g":14.8,"carbon-footprint-from-known-ingredients_product":50.3,"carbon-footprint-from-meat-or-fish_100g":14.8,"carbon-footprint-from-meat-or-fish_product":50.3,"energy":1209,"energy-kcal":292,"energy-kcal_100g":292,"energy-kcal_unit":"kcal","energy-kcal_value":292,"energy-kcal_value_computed":293.9,"energy-kj":1209,"energy-kj_100g":1209,"energy-kj_unit":"kJ","energy-kj_value":1209,"energy-kj_value_computed":1218.1,"energy_100g":1209,"energy_unit":"kJ","energy_value":1209,"fat":24.3,"fat_100g":24.3,"fat_unit":"g","fat_value":24.3,"fiber":1.2,"fiber_100g":1.2,"fiber_unit":"g","fiber_value":1.2,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"nova-group":4,"nova-group_100g":4,"nova-group_serving":4,"nutrition-score-fr":23,"nutrition-score-fr_100g":23,"proteins":15,"proteins_100g":15,"proteins_unit":"g","proteins_value":15,"salt":2.4,"salt_100g":2.4,"salt_unit":"g","salt_value":2.4,"saturated-fat":9.7,"saturated-fat_100g":9.7,"saturated-fat_unit":"g","saturated-fat_value":9.7,"sodium":0.96,"sodium_100g":0.96,"sodium_unit":"g","sodium_value":0.96,"sugars":1.3,"sugars_100g":1.3,"sugars_unit":"g","sugars_value":1.3}'::jsonb,
	NOW()
),

(
    '0096619427383',
    'Organic Eggs Grade AA Large',
    'Kirkland Signature',
    'https://images.openfoodfacts.org/images/products/009/661/942/7383/front_en.45.400.jpg',
    ARRAY['en:farming-products','en:eggs','en:chicken-eggs'],
    ARRAY['en:eggs'],
    140,
    12,
    NULL,
    10,
    '{"added-sugars":0,"added-sugars_100g":0,"added-sugars_serving":0,"added-sugars_unit":"g","added-sugars_value":0,"caffeine":0,"caffeine_100g":0,"caffeine_serving":0,"caffeine_unit":"mg","caffeine_value":0,"calcium":0.03,"calcium_100g":0.06,"calcium_label":"Calcium","calcium_serving":0.03,"calcium_unit":"g","calcium_value":0.03,"carbohydrates":0,"carbohydrates_100g":0,"carbohydrates_serving":0,"carbohydrates_unit":"g","carbohydrates_value":0,"cholesterol":0.185,"cholesterol_100g":0.37,"cholesterol_label":"Cholesterol","cholesterol_serving":0.185,"cholesterol_unit":"g","cholesterol_value":0.185,"choline":0,"choline_100g":0,"choline_label":"Choline","choline_serving":0,"choline_unit":"mg","choline_value":0,"copper":0,"copper_100g":0,"copper_serving":0,"copper_unit":"mg","copper_value":0,"energy":293,"energy-kcal":70,"energy-kcal_100g":140,"energy-kcal_serving":70,"energy-kcal_unit":"kcal","energy-kcal_value":70,"energy-kcal_value_computed":69,"energy_100g":586,"energy_serving":293,"energy_unit":"kcal","energy_value":70,"fat":5,"fat_100g":10,"fat_serving":5,"fat_unit":"g","fat_value":5,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"iron":0.0018,"iron_100g":0.0036,"iron_label":"Iron","iron_serving":0.0018,"iron_unit":"mg","iron_value":1.8,"magnesium":0,"magnesium_100g":0,"magnesium_serving":0,"magnesium_unit":"mg","magnesium_value":0,"manganese":0,"manganese_100g":0,"manganese_serving":0,"manganese_unit":"mg","manganese_value":0,"nova-group":1,"nova-group_100g":1,"nova-group_serving":1,"nutrition-score-fr":0,"nutrition-score-fr_100g":0,"phosphorus":0,"phosphorus_100g":0,"phosphorus_serving":0,"phosphorus_unit":"mg","phosphorus_value":0,"potassium":0.07,"potassium_100g":0.14,"potassium_label":"Potassium","potassium_serving":0.07,"potassium_unit":"g","potassium_value":0.07,"proteins":6,"proteins_100g":12,"proteins_serving":6,"proteins_unit":"g","proteins_value":6,"salt":0.175,"salt_100g":0.35,"salt_serving":0.175,"salt_unit":"g","salt_value":0.175,"saturated-fat":1.5,"saturated-fat_100g":3,"saturated-fat_serving":1.5,"saturated-fat_unit":"g","saturated-fat_value":1.5,"selenium":0,"selenium_100g":0,"selenium_serving":0,"selenium_unit":"mcg","selenium_value":0,"sodium":0.07,"sodium_100g":0.14,"sodium_serving":0.07,"sodium_unit":"g","sodium_value":0.07,"starch":0,"starch_100g":0,"starch_serving":0,"starch_unit":"g","starch_value":0,"vitamin-a":0,"vitamin-a_100g":0,"vitamin-a_serving":0,"vitamin-a_unit":"mcg","vitamin-a_value":0,"vitamin-b1":0,"vitamin-b12":0,"vitamin-b12_100g":0,"vitamin-b12_serving":0,"vitamin-b12_unit":"mcg","vitamin-b12_value":0,"vitamin-b1_100g":0,"vitamin-b1_serving":0,"vitamin-b1_unit":"mg","vitamin-b1_value":0,"vitamin-b2":0,"vitamin-b2_100g":0,"vitamin-b2_serving":0,"vitamin-b2_unit":"mg","vitamin-b2_value":0,"vitamin-b6":0,"vitamin-b6_100g":0,"vitamin-b6_serving":0,"vitamin-b6_unit":"mg","vitamin-b6_value":0,"vitamin-b9":0,"vitamin-b9_100g":0,"vitamin-b9_serving":0,"vitamin-b9_unit":"mcg","vitamin-b9_value":0,"vitamin-c":0,"vitamin-c_100g":0,"vitamin-c_serving":0,"vitamin-c_unit":"mg","vitamin-c_value":0,"vitamin-e":0,"vitamin-e_100g":0,"vitamin-e_serving":0,"vitamin-e_unit":"mg","vitamin-e_value":0,"vitamin-k":0,"vitamin-k_100g":0,"vitamin-k_serving":0,"vitamin-k_unit":"mcg","vitamin-k_value":0,"zinc":0,"zinc_100g":0,"zinc_serving":0,"zinc_unit":"mg","zinc_value":0}'::jsonb,
	NOW()
),

(
    '0742365264450',
    'Organic Whole Milk',
    'Horizon Organic',
    'https://images.openfoodfacts.org/images/products/074/236/526/4450/front_en.42.400.jpg',
    ARRAY['en:dairies','en:milks','en:cow-milks'],
    ARRAY[''],
    66.7,
    3.33,
    5.42,
    3.33,
    '{"added-sugars":0,"added-sugars_100g":0,"added-sugars_serving":0,"added-sugars_unit":"g","added-sugars_value":0,"calcium":0.31,"calcium_100g":0.129,"calcium_serving":0.31,"calcium_unit":"g","calcium_value":0.31,"carbohydrates":13,"carbohydrates_100g":5.42,"carbohydrates_serving":13,"carbohydrates_unit":"g","carbohydrates_value":13,"cholesterol":0.035,"cholesterol_100g":0.0146,"cholesterol_serving":0.035,"cholesterol_unit":"g","cholesterol_value":0.035,"energy":669,"energy-kcal":160,"energy-kcal_100g":66.7,"energy-kcal_serving":160,"energy-kcal_unit":"kcal","energy-kcal_value":160,"energy-kcal_value_computed":156,"energy_100g":279,"energy_serving":669,"energy_unit":"kcal","energy_value":160,"fat":8,"fat_100g":3.33,"fat_serving":8,"fat_unit":"g","fat_value":8,"fiber":0,"fiber_100g":0,"fiber_serving":0,"fiber_unit":"g","fiber_value":0,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"iron":0,"iron_100g":0,"iron_serving":0,"iron_unit":"g","iron_value":0,"monounsaturated-fat":2.5,"monounsaturated-fat_100g":1.04,"monounsaturated-fat_serving":2.5,"monounsaturated-fat_unit":"g","monounsaturated-fat_value":2.5,"nova-group":1,"nova-group_100g":1,"nova-group_serving":1,"nutrition-score-fr":4,"nutrition-score-fr_100g":4,"phosphorus":0.24,"phosphorus_100g":0.1,"phosphorus_serving":0.24,"phosphorus_unit":"g","phosphorus_value":0.24,"polyunsaturated-fat":0,"polyunsaturated-fat_100g":0,"polyunsaturated-fat_serving":0,"polyunsaturated-fat_unit":"g","polyunsaturated-fat_value":0,"potassium":0.41,"potassium_100g":0.171,"potassium_serving":0.41,"potassium_unit":"g","potassium_value":0.41,"proteins":8,"proteins_100g":3.33,"proteins_serving":8,"proteins_unit":"g","proteins_value":8,"salt":0.3375,"salt_100g":0.141,"salt_serving":0.3375,"salt_unit":"g","salt_value":0.3375,"saturated-fat":5,"saturated-fat_100g":2.08,"saturated-fat_serving":5,"saturated-fat_unit":"g","saturated-fat_value":5,"sodium":0.135,"sodium_100g":0.0563,"sodium_serving":0.135,"sodium_unit":"g","sodium_value":0.135,"sugars":12,"sugars_100g":5,"sugars_serving":12,"sugars_unit":"g","sugars_value":12,"trans-fat":0,"trans-fat_100g":0,"trans-fat_serving":0,"trans-fat_unit":"g","trans-fat_value":0,"vitamin-b12":0.0000012,"vitamin-b12_100g":5e-7,"vitamin-b12_serving":0.0000012,"vitamin-b12_unit":"g","vitamin-b12_value":0.0000012,"vitamin-b2":0.00009,"vitamin-b2_100g":0.0000375,"vitamin-b2_serving":0.00009,"vitamin-b2_unit":"g","vitamin-b2_value":0.00009,"vitamin-d":0.0000045,"vitamin-d_100g":0.00000188,"vitamin-d_serving":0.0000045,"vitamin-d_unit":"g","vitamin-d_value":0.0000045}'::jsonb,
	NOW()
),

(
    '0072250037068',
    'Honey Wheat',
    'Nature''s Own',
    'https://images.openfoodfacts.org/images/products/007/225/003/7068/front_en.110.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:cereals-and-potatoes','en:cereals-and-their-products','en:breads','en:sliced-breads','en:wholemeal-breads','en:wholemeal-sliced-breads'],
    ARRAY['en:gluten','en:soybeans'],
    269,
    11.5,
    53.8,
    1.92,
    '{"added-sugars":2,"added-sugars_100g":7.69,"added-sugars_serving":2,"added-sugars_unit":"g","added-sugars_value":2,"calcium":0.05,"calcium_100g":0.192,"calcium_serving":0.05,"calcium_unit":"g","calcium_value":0.05,"carbohydrates":14,"carbohydrates_100g":53.8,"carbohydrates_serving":14,"carbohydrates_unit":"g","carbohydrates_value":14,"choline":0,"choline_100g":0,"choline_serving":0,"choline_unit":"mg","choline_value":0,"energy":293,"energy-kcal":70,"energy-kcal_100g":269,"energy-kcal_serving":70,"energy-kcal_unit":"kcal","energy-kcal_value":70,"energy-kcal_value_computed":73.9,"energy_100g":1130,"energy_serving":293,"energy_unit":"kcal","energy_value":70,"fat":0.5,"fat_100g":1.92,"fat_serving":0.5,"fat_unit":"g","fat_value":0.5,"fiber":0.7,"fiber_100g":2.69,"fiber_serving":0.7,"fiber_unit":"g","fiber_value":0.7,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"iron":0.0011,"iron_100g":0.00423,"iron_serving":0.0011,"iron_unit":"g","iron_value":0.0011,"nova-group":4,"nova-group_100g":4,"nova-group_serving":4,"potassium":0.04,"potassium_100g":0.154,"potassium_serving":0.04,"potassium_unit":"g","potassium_value":0.04,"proteins":3,"proteins_100g":11.5,"proteins_serving":3,"proteins_unit":"g","proteins_value":3,"salt":0.3,"salt_100g":1.15,"salt_serving":0.3,"salt_unit":"g","salt_value":0.3,"sodium":0.12,"sodium_100g":0.462,"sodium_serving":0.12,"sodium_unit":"g","sodium_value":0.12,"starch":0,"starch_100g":0,"starch_serving":0,"starch_unit":"g","starch_value":0,"sugars":2,"sugars_100g":7.69,"sugars_serving":2,"sugars_unit":"g","sugars_value":2,"vitamin-b1":0.00015,"vitamin-b1_100g":0.000577,"vitamin-b1_serving":0.00015,"vitamin-b1_unit":"g","vitamin-b1_value":0.00015,"vitamin-b2":0.00009,"vitamin-b2_100g":0.000346,"vitamin-b2_serving":0.00009,"vitamin-b2_unit":"g","vitamin-b2_value":0.00009,"vitamin-b9":0.00006,"vitamin-b9_100g":0.000231,"vitamin-b9_serving":0.00006,"vitamin-b9_unit":"g","vitamin-b9_value":0.00006,"vitamin-pp":0.004643,"vitamin-pp_100g":0.0179,"vitamin-pp_serving":0.004643,"vitamin-pp_unit":"g","vitamin-pp_value":0.004643}'::jsonb,
	NOW()
),

(
    '8076800195057',
    'SPAGHETTI N° 5',
    'Barilla',
    'https://images.openfoodfacts.org/images/products/807/680/019/5057/front_en.3428.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:cereals-and-potatoes','en:cereals-and-their-products','en:pastas','en:cereal-pastas','en:dry-pastas','en:durum-wheat-pasta','en:spaghetti','en:dry-durum-wheat-pasta','en:durum-wheat-spaghetti'],
    ARRAY['en:gluten'],
    359,
    13,
    71,
    2,
    '{"carbohydrates":71,"carbohydrates_100g":71,"carbohydrates_serving":60.3,"carbohydrates_unit":"g","carbohydrates_value":71,"choline":0,"choline_100g":0,"choline_serving":0,"choline_unit":"mg","choline_value":0,"energy":1521,"energy-kcal":359,"energy-kcal_100g":359,"energy-kcal_serving":305,"energy-kcal_unit":"kcal","energy-kcal_value":359,"energy-kcal_value_computed":360,"energy-kj":1521,"energy-kj_100g":1521,"energy-kj_serving":1290,"energy-kj_unit":"kJ","energy-kj_value":1521,"energy-kj_value_computed":1526,"energy_100g":1521,"energy_serving":1290,"energy_unit":"kJ","energy_value":1521,"fat":2,"fat_100g":2,"fat_serving":1.7,"fat_unit":"g","fat_value":2,"fiber":3,"fiber_100g":3,"fiber_serving":2.55,"fiber_unit":"g","fiber_value":3,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts_100g":0,"fruits-vegetables-nuts_serving":0,"fruits-vegetables-nuts_unit":"g","fruits-vegetables-nuts_value":0,"nova-group":1,"nova-group_100g":1,"nova-group_serving":1,"nutrition-score-fr":0,"nutrition-score-fr_100g":0,"proteins":13,"proteins_100g":13,"proteins_serving":11.1,"proteins_unit":"g","proteins_value":13,"salt":0.01,"salt_100g":0.01,"salt_serving":0.0085,"salt_unit":"g","salt_value":0.01,"saturated-fat":0.5,"saturated-fat_100g":0.5,"saturated-fat_serving":0.425,"saturated-fat_unit":"g","saturated-fat_value":0.5,"sodium":0.004,"sodium_100g":0.004,"sodium_serving":0.0034,"sodium_unit":"g","sodium_value":0.004,"starch":0,"starch_100g":0,"starch_serving":0,"starch_unit":"g","starch_value":0,"sugars":3.5,"sugars_100g":3.5,"sugars_serving":2.98,"sugars_unit":"g","sugars_value":3.5}'::jsonb,
	NOW()
),

(
    '7610632002001',
    'Avocado',
    'null',
    'https://images.openfoodfacts.org/images/products/761/063/200/2001/front_de.3.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:fruits-and-vegetables-based-foods','en:fruits-based-foods','en:fruits','en:tropical-fruits','en:avocados'],
    ARRAY[''],
    NULL,
    NULL,
    NULL,
    NULL,
    '{"fruits-vegetables-legumes-estimate-from-ingredients_100g":100,"fruits-vegetables-legumes-estimate-from-ingredients_serving":100,"fruits-vegetables-nuts-estimate-from-ingredients_100g":100,"fruits-vegetables-nuts-estimate-from-ingredients_serving":100,"nova-group":1,"nova-group_100g":1,"nova-group_serving":1,"nutrition-score-fr":0,"nutrition-score-fr_100g":0}'::jsonb,
	NOW()
),

(
    '0096619308293',
    'Organic broccoli florets',
    'Kirkland',
    'https://images.openfoodfacts.org/images/products/009/661/930/8293/front_en.3.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:fruits-and-vegetables-based-foods','en:vegetables-based-foods','en:frozen-foods','en:vegetables','en:frozen-plant-based-foods','en:frozen-vegetables','en:broccoli','en:broccoli-florets'],
    ARRAY[''],
    29.4,
    3.53,
    5.88,
    NULL,
    '{"calcium":0.03502,"calcium_100g":0.0412,"calcium_serving":0.03502,"calcium_unit":"g","calcium_value":0.03502,"carbohydrates":4.998,"carbohydrates_100g":5.88,"carbohydrates_serving":4.998,"carbohydrates_unit":"g","carbohydrates_value":4.998,"energy":105,"energy-kcal":24.99,"energy-kcal_100g":29.4,"energy-kcal_serving":24.99,"energy-kcal_unit":"kcal","energy-kcal_value":24.99,"energy-kcal_value_computed":37.994,"energy_100g":124,"energy_serving":105,"energy_unit":"kcal","energy_value":24.99,"fat":0,"fat_100g":0,"fat_serving":0,"fat_unit":"g","fat_value":0,"fiber":3.001,"fiber_100g":3.53,"fiber_serving":3.001,"fiber_unit":"g","fiber_value":3.001,"fruits-vegetables-legumes-estimate-from-ingredients_100g":100,"fruits-vegetables-legumes-estimate-from-ingredients_serving":100,"fruits-vegetables-nuts-estimate-from-ingredients_100g":100,"fruits-vegetables-nuts-estimate-from-ingredients_serving":100,"iron":0.001003,"iron_100g":0.00118,"iron_serving":0.001003,"iron_unit":"g","iron_value":0.001003,"nova-group":1,"nova-group_100g":1,"nova-group_serving":1,"nutrition-score-fr":-7,"nutrition-score-fr_100g":-7,"potassium":0.21335,"potassium_100g":0.251,"potassium_serving":0.21335,"potassium_unit":"g","potassium_value":0.21335,"proteins":3,"proteins_100g":3.53,"proteins_serving":3,"proteins_unit":"g","proteins_value":3,"salt":0.0374,"salt_100g":0.044,"salt_serving":0.0374,"salt_unit":"g","salt_value":0.0374,"sodium":0.01496,"sodium_100g":0.0176,"sodium_serving":0.01496,"sodium_unit":"g","sodium_value":0.01496,"sugars":1.003,"sugars_100g":1.18,"sugars_serving":1.003,"sugars_unit":"g","sugars_value":1.003,"vitamin-a":0.000048025,"vitamin-a_100g":0.0000565,"vitamin-a_serving":0.000048025,"vitamin-a_unit":"g","vitamin-a_value":0.000048025,"vitamin-c":0.05797,"vitamin-c_100g":0.0682,"vitamin-c_serving":0.05797,"vitamin-c_unit":"g","vitamin-c_value":0.05797}'::jsonb,
	NOW()
),

(
    '0077013615606',
    'Lightly Breaded Chicken Breast Original Strips',
    'Just Bare',
    'https://images.openfoodfacts.org/images/products/007/701/361/5606/front_en.44.400.jpg',
    ARRAY['en:lightly-breaded-chicken-breast-strips'],
    ARRAY['en:celery','en:eggs','en:gluten','en:milk','en:soybeans'],
    183,
    18.3,
    11.8,
    6.45,
    '{"added-sugars":2,"added-sugars_100g":2.15,"added-sugars_serving":2,"added-sugars_unit":"g","added-sugars_value":2,"calcium":0.011,"calcium_100g":0.0118,"calcium_serving":0.011,"calcium_unit":"g","calcium_value":0.011,"carbohydrates":11,"carbohydrates_100g":11.8,"carbohydrates_serving":11,"carbohydrates_unit":"g","carbohydrates_value":11,"cholesterol":0.05,"cholesterol_100g":0.0538,"cholesterol_serving":0.05,"cholesterol_unit":"g","cholesterol_value":0.05,"choline":0,"choline_100g":0,"choline_serving":0,"choline_unit":"mg","choline_value":0,"energy":711,"energy-kcal":170,"energy-kcal_100g":183,"energy-kcal_serving":170,"energy-kcal_unit":"kcal","energy-kcal_value":170,"energy-kcal_value_computed":166,"energy_100g":765,"energy_serving":711,"energy_unit":"kcal","energy_value":170,"fat":6,"fat_100g":6.45,"fat_serving":6,"fat_unit":"g","fat_value":6,"fiber":0,"fiber_100g":0,"fiber_serving":0,"fiber_unit":"g","fiber_value":0,"fruits-vegetables-legumes-estimate-from-ingredients_100g":1.185,"fruits-vegetables-legumes-estimate-from-ingredients_serving":1.185,"fruits-vegetables-nuts-estimate-from-ingredients_100g":2.37,"fruits-vegetables-nuts-estimate-from-ingredients_serving":2.37,"iron":0.0005,"iron_100g":0.000538,"iron_serving":0.0005,"iron_unit":"g","iron_value":0.0005,"monounsaturated-fat":1.6,"monounsaturated-fat_100g":1.72,"monounsaturated-fat_serving":1.6,"monounsaturated-fat_unit":"g","monounsaturated-fat_value":1.6,"nova-group":3,"nova-group_100g":3,"nova-group_serving":3,"nutrition-score-fr":11,"nutrition-score-fr_100g":11,"polyunsaturated-fat":3.2,"polyunsaturated-fat_100g":3.44,"polyunsaturated-fat_serving":3.2,"polyunsaturated-fat_unit":"g","polyunsaturated-fat_value":3.2,"potassium":0.387,"potassium_100g":0.416,"potassium_serving":0.387,"potassium_unit":"g","potassium_value":0.387,"proteins":17,"proteins_100g":18.3,"proteins_serving":17,"proteins_unit":"g","proteins_value":17,"salt":1.55,"salt_100g":1.67,"salt_serving":1.55,"salt_unit":"g","salt_value":1.55,"saturated-fat":1,"saturated-fat_100g":1.08,"saturated-fat_serving":1,"saturated-fat_unit":"g","saturated-fat_value":1,"sodium":0.62,"sodium_100g":0.667,"sodium_serving":0.62,"sodium_unit":"g","sodium_value":0.62,"starch":0,"starch_100g":0,"starch_serving":0,"starch_unit":"g","starch_value":0,"sugars":2,"sugars_100g":2.15,"sugars_serving":2,"sugars_unit":"g","sugars_value":2,"trans-fat":0,"trans-fat_100g":0,"trans-fat_serving":0,"trans-fat_unit":"g","trans-fat_value":0,"vitamin-d":1e-7,"vitamin-d_100g":1.08e-7,"vitamin-d_serving":1e-7,"vitamin-d_unit":"g","vitamin-d_value":1e-7}'::jsonb,
	NOW()
),

(
    '0033383666020',
    'Baby Carrots',
    'Grimmway Farms',
    'https://images.openfoodfacts.org/images/products/003/338/366/6020/front_en.53.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:fruits-and-vegetables-based-foods','en:vegetables-based-foods','en:vegetables','en:carrots'],
    ARRAY[''],
    35.3,
    1.18,
    8.24,
    NULL,
    '{"added-sugars":0,"added-sugars_100g":0,"added-sugars_serving":0,"added-sugars_unit":"g","added-sugars_value":0,"caffeine":0,"caffeine_100g":0,"caffeine_serving":0,"caffeine_unit":"mg","caffeine_value":0,"calcium":0.03,"calcium_100g":0.0353,"calcium_serving":0.03,"calcium_unit":"g","calcium_value":0.03,"carbohydrates":7,"carbohydrates_100g":8.24,"carbohydrates_serving":7,"carbohydrates_unit":"g","carbohydrates_value":7,"cholesterol":0,"cholesterol_100g":0,"cholesterol_serving":0,"cholesterol_unit":"g","cholesterol_value":0,"choline":0,"choline_100g":0,"choline_serving":0,"choline_unit":"mg","choline_value":0,"copper":0,"copper_100g":0,"copper_serving":0,"copper_unit":"mg","copper_value":0,"energy":126,"energy-kcal":30,"energy-kcal_100g":35.3,"energy-kcal_serving":30,"energy-kcal_unit":"kcal","energy-kcal_value":30,"energy-kcal_value_computed":38,"energy_100g":148,"energy_serving":126,"energy_unit":"kcal","energy_value":30,"fat":0,"fat_100g":0,"fat_serving":0,"fat_unit":"g","fat_value":0,"fiber":3,"fiber_100g":3.53,"fiber_serving":3,"fiber_unit":"g","fiber_value":3,"fruits-vegetables-legumes-estimate-from-ingredients_100g":100,"fruits-vegetables-legumes-estimate-from-ingredients_serving":100,"fruits-vegetables-nuts-estimate-from-ingredients_100g":100,"fruits-vegetables-nuts-estimate-from-ingredients_serving":100,"iron":0.000941176470588235,"iron_100g":0.00111,"iron_serving":0.000941176470588235,"iron_unit":"mg","iron_value":0.941176470588235,"magnesium":0,"magnesium_100g":0,"magnesium_serving":0,"magnesium_unit":"mg","magnesium_value":0,"manganese":0,"manganese_100g":0,"manganese_serving":0,"manganese_unit":"mg","manganese_value":0,"nova-group":1,"nova-group_100g":1,"nova-group_serving":1,"nutrition-score-fr":-5,"nutrition-score-fr_100g":-5,"phosphorus":0,"phosphorus_100g":0,"phosphorus_serving":0,"phosphorus_unit":"mg","phosphorus_value":0,"potassium":0.2,"potassium_100g":0.235,"potassium_serving":0.2,"potassium_unit":"g","potassium_value":0.2,"proteins":1,"proteins_100g":1.18,"proteins_serving":1,"proteins_unit":"g","proteins_value":1,"salt":0.1625,"salt_100g":0.191,"salt_serving":0.1625,"salt_unit":"g","salt_value":0.1625,"saturated-fat":0,"saturated-fat_100g":0,"saturated-fat_serving":0,"saturated-fat_unit":"g","saturated-fat_value":0,"selenium":0,"selenium_100g":0,"selenium_serving":0,"selenium_unit":"mcg","selenium_value":0,"sodium":0.065,"sodium_100g":0.0765,"sodium_serving":0.065,"sodium_unit":"g","sodium_value":0.065,"starch":0,"starch_100g":0,"starch_serving":0,"starch_unit":"g","starch_value":0,"sugars":4,"sugars_100g":4.71,"sugars_serving":4,"sugars_unit":"g","sugars_value":4,"trans-fat":0,"trans-fat_100g":0,"trans-fat_serving":0,"trans-fat_unit":"g","trans-fat_value":0,"vitamin-a":0.000694117647058824,"vitamin-a_100g":0.000817,"vitamin-a_serving":0.000694117647058824,"vitamin-a_unit":"mcg","vitamin-a_value":694.117647058824,"vitamin-b1":0,"vitamin-b12":0,"vitamin-b12_100g":0,"vitamin-b12_serving":0,"vitamin-b12_unit":"mcg","vitamin-b12_value":0,"vitamin-b1_100g":0,"vitamin-b1_serving":0,"vitamin-b1_unit":"mg","vitamin-b1_value":0,"vitamin-b2":0,"vitamin-b2_100g":0,"vitamin-b2_serving":0,"vitamin-b2_unit":"mg","vitamin-b2_value":0,"vitamin-b6":0,"vitamin-b6_100g":0,"vitamin-b6_serving":0,"vitamin-b6_unit":"mg","vitamin-b6_value":0,"vitamin-b9":0,"vitamin-b9_100g":0,"vitamin-b9_serving":0,"vitamin-b9_unit":"mcg","vitamin-b9_value":0,"vitamin-c":0.00235294117647059,"vitamin-c_100g":0.00277,"vitamin-c_serving":0.00235294117647059,"vitamin-c_unit":"mg","vitamin-c_value":2.35294117647059,"vitamin-d":0,"vitamin-d_100g":0,"vitamin-d_serving":0,"vitamin-d_unit":"g","vitamin-d_value":0,"vitamin-e":0,"vitamin-e_100g":0,"vitamin-e_serving":0,"vitamin-e_unit":"mg","vitamin-e_value":0,"vitamin-k":0,"vitamin-k_100g":0,"vitamin-k_serving":0,"vitamin-k_unit":"mcg","vitamin-k_value":0,"zinc":0,"zinc_100g":0,"zinc_serving":0,"zinc_unit":"mg","zinc_value":0}'::jsonb,
	NOW()
),

(
    '0024300044311',
    'Mini powdered donuts',
    'Little Debbie, Mckee Foods',
    'https://images.openfoodfacts.org/images/products/002/430/004/4311/front_en.37.400.jpg',
    ARRAY['en:snacks','en:sweet-snacks','en:confectioneries','en:biscuits-and-cakes','en:cakes','en:candies','en:doughnuts'],
    ARRAY['en:eggs','en:gluten','en:milk','en:soybeans','en:lemon'],
    434,
    5.66,
    54.7,
    22.6,
    '{"added-sugars":15,"added-sugars_100g":28.3,"added-sugars_serving":15,"added-sugars_unit":"g","added-sugars_value":15,"calcium":0.02,"calcium_100g":0.0377,"calcium_serving":0.02,"calcium_unit":"g","calcium_value":0.02,"carbohydrates":28.9999999989,"carbohydrates_100g":54.7,"carbohydrates_serving":28.9999999989,"carbohydrates_unit":"g","carbohydrates_value":28.9999999989,"cholesterol":0.015,"cholesterol_100g":0.0283,"cholesterol_serving":0.015,"cholesterol_unit":"g","cholesterol_value":0.015,"energy":962,"energy-from-fat":418,"energy-from-fat_100g":789,"energy-from-fat_serving":418,"energy-from-fat_unit":"kcal","energy-from-fat_value":100,"energy-kcal":229.9999999995,"energy-kcal_100g":434,"energy-kcal_serving":229.9999999995,"energy-kcal_unit":"kcal","energy-kcal_value":229.9999999995,"energy-kcal_value_computed":235.9999999799,"energy_100g":1820,"energy_serving":962,"energy_unit":"kcal","energy_value":230,"fat":11.9999999979,"fat_100g":22.6,"fat_serving":11.9999999979,"fat_unit":"g","fat_value":11.9999999979,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"iron":0.0011,"iron_100g":0.00208,"iron_serving":0.0011,"iron_unit":"g","iron_value":0.0011,"monounsaturated-fat":3.5,"monounsaturated-fat_100g":6.6,"monounsaturated-fat_serving":3.5,"monounsaturated-fat_unit":"g","monounsaturated-fat_value":3.5,"nova-group":4,"nova-group_100g":4,"nova-group_serving":4,"nutrition-score-fr":27,"nutrition-score-fr_100g":27,"polyunsaturated-fat":1.5,"polyunsaturated-fat_100g":2.83,"polyunsaturated-fat_serving":1.5,"polyunsaturated-fat_unit":"g","polyunsaturated-fat_value":1.5,"potassium":0.065,"potassium_100g":0.123,"potassium_serving":0.065,"potassium_unit":"g","potassium_value":0.065,"proteins":3.0000000008,"proteins_100g":5.66,"proteins_serving":3.0000000008,"proteins_unit":"g","proteins_value":3.0000000008,"salt":0.525,"salt_100g":0.991,"salt_serving":0.525,"salt_unit":"g","salt_value":0.525,"saturated-fat":6,"saturated-fat_100g":11.3,"saturated-fat_serving":6,"saturated-fat_unit":"g","saturated-fat_value":6,"sodium":0.21,"sodium_100g":0.396,"sodium_serving":0.21,"sodium_unit":"g","sodium_value":0.21,"sugars":15,"sugars_100g":28.3,"sugars_serving":15,"sugars_unit":"g","sugars_value":15}'::jsonb,
	NOW()
),

(
    '0705599014147',
    'Protein Packed Oatmeal Maple & Brown Sugar',
    'Kodiak',
    'https://images.openfoodfacts.org/images/products/070/559/901/4147/front_en.60.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:breakfasts','en:cereals-and-potatoes','en:cereals-and-their-products','en:breakfast-cereals','en:porridge'],
    ARRAY['en:milk'],
    380,
    24,
    62,
    5,
    '{"added-sugars":10,"added-sugars_100g":20,"added-sugars_serving":10,"added-sugars_unit":"g","added-sugars_value":10,"calcium":0.11,"calcium_100g":0.22,"calcium_serving":0.11,"calcium_unit":"g","calcium_value":0.11,"carbohydrates":31,"carbohydrates_100g":62,"carbohydrates_serving":31,"carbohydrates_unit":"g","carbohydrates_value":31,"carbon-footprint-from-known-ingredients_100g":30,"carbon-footprint-from-known-ingredients_product":89.8,"carbon-footprint-from-known-ingredients_serving":15,"cholesterol":0.005,"cholesterol_100g":0.01,"cholesterol_serving":0.005,"cholesterol_unit":"g","cholesterol_value":0.005,"choline":0,"choline_100g":0,"choline_serving":0,"choline_unit":"mg","choline_value":0,"energy":795,"energy-kcal":190,"energy-kcal_100g":380,"energy-kcal_serving":190,"energy-kcal_unit":"kcal","energy-kcal_value":190,"energy-kcal_value_computed":200.5,"energy_100g":1590,"energy_serving":795,"energy_unit":"kcal","energy_value":190,"fat":2.5,"fat_100g":5,"fat_serving":2.5,"fat_unit":"g","fat_value":2.5,"fiber":3,"fiber_100g":6,"fiber_serving":3,"fiber_unit":"g","fiber_value":3,"fruits-vegetables-legumes-estimate-from-ingredients_100g":0,"fruits-vegetables-legumes-estimate-from-ingredients_serving":0,"fruits-vegetables-nuts-estimate-from-ingredients_100g":0,"fruits-vegetables-nuts-estimate-from-ingredients_serving":0,"iron":0.0023,"iron_100g":0.0046,"iron_serving":0.0023,"iron_unit":"g","iron_value":0.0023,"nova-group":4,"nova-group_100g":4,"nova-group_serving":4,"nutrition-score-fr":10,"nutrition-score-fr_100g":10,"potassium":0.14,"potassium_100g":0.28,"potassium_serving":0.14,"potassium_unit":"g","potassium_value":0.14,"proteins":12,"proteins_100g":24,"proteins_serving":12,"proteins_unit":"g","proteins_value":12,"salt":0.425,"salt_100g":0.85,"salt_serving":0.425,"salt_unit":"g","salt_value":0.425,"saturated-fat":0.5,"saturated-fat_100g":1,"saturated-fat_serving":0.5,"saturated-fat_unit":"g","saturated-fat_value":0.5,"sodium":0.17,"sodium_100g":0.34,"sodium_serving":0.17,"sodium_unit":"g","sodium_value":0.17,"starch":0,"starch_100g":0,"starch_serving":0,"starch_unit":"g","starch_value":0,"sugars":10,"sugars_100g":20,"sugars_serving":10,"sugars_unit":"g","sugars_value":10}'::jsonb,
	NOW()
),

(
    '00004067',
    'Zucchini',
    'null',
    'https://images.openfoodfacts.org/images/products/000/000/000/4067/front_en.16.400.jpg',
    ARRAY['en:plant-based-foods-and-beverages','en:plant-based-foods','en:fruits-and-vegetables-based-foods','en:vegetables-based-foods','en:vegetables','en:fresh-foods','en:fresh-plant-based-foods','en:fresh-vegetables','en:zucchini','en:fresh-zucchini'],
    ARRAY[''],
    16,
    1,
    3,
    NULL,
    '{"carbohydrates":3,"carbohydrates_100g":3,"carbohydrates_unit":"g","carbohydrates_value":3,"energy":67,"energy-kcal":16,"energy-kcal_100g":16,"energy-kcal_unit":"kcal","energy-kcal_value":16,"energy-kcal_value_computed":16,"energy_100g":67,"energy_unit":"kcal","energy_value":16,"fat":0,"fat_100g":0,"fat_unit":"g","fat_value":0,"fruits-vegetables-legumes-estimate-from-ingredients_100g":100,"fruits-vegetables-legumes-estimate-from-ingredients_serving":100,"fruits-vegetables-nuts-estimate-from-ingredients_100g":100,"fruits-vegetables-nuts-estimate-from-ingredients_serving":100,"nova-group":1,"nova-group_100g":1,"nova-group_serving":1,"proteins":1,"proteins_100g":1,"proteins_unit":"g","proteins_value":1}'::jsonb,
	NOW()
);

