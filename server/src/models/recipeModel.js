// *************************************
// *         Recipe Functions          *
// *************************************

const pool = require('../config/database');

// Verify a recipe belongs to a user
async function verifyRecipeOwnership(recipeId, userId) {
  const result = await pool.query(
    'SELECT recipe_id FROM recipe WHERE recipe_id = $1 AND user_id = $2',
    [recipeId, userId]
  );
  return result.rows.length > 0;
}

// Create a new recipe with ingredients and instructions in a single transaction
async function createRecipe(userId, { recipe_name, servings, prep_time_minutes, cook_time_minutes, image_url, ingredients, instructions }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert recipe
    const recipeResult = await client.query(
      `INSERT INTO recipe (user_id, recipe_name, servings, prep_time_minutes, cook_time_minutes, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, recipe_name, servings || 1, prep_time_minutes || null, cook_time_minutes || null, image_url || null]
    );
    const recipe = recipeResult.rows[0];

    // Insert ingredients
    const insertedIngredients = [];
    if (ingredients && ingredients.length > 0) {
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        const result = await client.query(
          `INSERT INTO recipe_ingredient (recipe_id, product_id, custom_product_id, free_text, quantity, unit, display_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [recipe.recipe_id, ing.product_id || null, ing.custom_product_id || null, ing.free_text || null, ing.quantity || null, ing.unit || null, ing.display_order ?? i]
        );
        insertedIngredients.push(result.rows[0]);
      }
    }

    // Insert instructions
    const insertedInstructions = [];
    if (instructions && instructions.length > 0) {
      for (let i = 0; i < instructions.length; i++) {
        const inst = instructions[i];
        const result = await client.query(
          `INSERT INTO recipe_instruction (recipe_id, step_number, content, metadata)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [recipe.recipe_id, inst.step_number || i + 1, inst.content, inst.metadata || '{}']
        );
        insertedInstructions.push(result.rows[0]);
      }
    }

    await client.query('COMMIT');

    return {
      ...recipe,
      ingredients: insertedIngredients,
      instructions: insertedInstructions
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Get all recipes for a user
async function getRecipesByUserId(userId) {
  const result = await pool.query(
    'SELECT * FROM recipe WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  );
  return result.rows;
}

// Get a single recipe with ingredients and instructions
async function getRecipeById(recipeId) {
  const recipeResult = await pool.query(
    'SELECT * FROM recipe WHERE recipe_id = $1',
    [recipeId]
  );

  if (recipeResult.rows.length === 0) {
    return null;
  }

  const recipe = recipeResult.rows[0];

  // Get ingredients with product recipe_names
  const ingredientsResult = await pool.query(
    `SELECT
      ri.ingredient_id, ri.product_id, ri.custom_product_id, ri.free_text,
      ri.quantity, ri.unit, ri.display_order,
      COALESCE(p.product_recipe_name, cp.product_recipe_name) AS product_recipe_name
    FROM recipe_ingredient ri
    LEFT JOIN product p ON ri.product_id = p.product_id
    LEFT JOIN custom_product cp ON ri.custom_product_id = cp.custom_product_id
    WHERE ri.recipe_id = $1
    ORDER BY ri.display_order, ri.ingredient_id`,
    [recipeId]
  );

  // Get instructions
  const instructionsResult = await pool.query(
    'SELECT * FROM recipe_instruction WHERE recipe_id = $1 ORDER BY step_number',
    [recipeId]
  );

  return {
    ...recipe,
    ingredients: ingredientsResult.rows,
    instructions: instructionsResult.rows
  };
}

// Update recipe metadata (partial updates)
async function updateRecipe(recipeId, updateData) {
  const allowedFields = [
    'recipe_name',
    'servings',
    'prep_time_minutes',
    'cook_time_minutes',
    'image_url'
  ];

  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (updateData.hasOwnProperty(field)) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(updateData[field]);
      paramIndex++;
    }
  }

  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }

  // Always update updated_at
  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(recipeId);

  const query = `
    UPDATE recipe
    SET ${updates.join(', ')}
    WHERE recipe_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Delete a recipe
async function deleteRecipe(recipeId, userId) {
  const result = await pool.query(
    'DELETE FROM recipe WHERE recipe_id = $1 AND user_id = $2 RETURNING *',
    [recipeId, userId]
  );
  return result.rows[0];
}

// *************************************
// *     Ingredient Functions          *
// *************************************

// Add an ingredient to a recipe
async function addIngredient(recipeId, { product_id, custom_product_id, free_text, quantity, unit, display_order }) {
  // If no display_order provided, append at end
  if (display_order === undefined || display_order === null) {
    const maxOrder = await pool.query(
      'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM recipe_ingredient WHERE recipe_id = $1',
      [recipeId]
    );
    display_order = maxOrder.rows[0].next_order;
  }

  const result = await pool.query(
    `INSERT INTO recipe_ingredient (recipe_id, product_id, custom_product_id, free_text, quantity, unit, display_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [recipeId, product_id || null, custom_product_id || null, free_text || null, quantity || null, unit || null, display_order]
  );

  // Update recipe's updated_at
  await pool.query('UPDATE recipe SET updated_at = CURRENT_TIMESTAMP WHERE recipe_id = $1', [recipeId]);

  return result.rows[0];
}

// Update an ingredient
async function updateIngredient(ingredientId, recipeId, updateData) {
  const allowedFields = [
    'product_id',
    'custom_product_id',
    'free_text',
    'quantity',
    'unit',
    'display_order'
  ];

  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (updateData.hasOwnProperty(field)) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(updateData[field]);
      paramIndex++;
    }
  }

  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(ingredientId);
  values.push(recipeId);

  const query = `
    UPDATE recipe_ingredient
    SET ${updates.join(', ')}
    WHERE ingredient_id = $${paramIndex} AND recipe_id = $${paramIndex + 1}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  if (result.rows.length > 0) {
    // Update recipe's updated_at
    await pool.query('UPDATE recipe SET updated_at = CURRENT_TIMESTAMP WHERE recipe_id = $1', [recipeId]);
  }

  return result.rows[0];
}

// Remove an ingredient
async function removeIngredient(ingredientId, recipeId) {
  const result = await pool.query(
    'DELETE FROM recipe_ingredient WHERE ingredient_id = $1 AND recipe_id = $2 RETURNING *',
    [ingredientId, recipeId]
  );

  if (result.rows.length > 0) {
    await pool.query('UPDATE recipe SET updated_at = CURRENT_TIMESTAMP WHERE recipe_id = $1', [recipeId]);
  }

  return result.rows[0];
}

// *************************************
// *     Instruction Functions         *
// *************************************

// Add an instruction (appended at end)
async function addInstruction(recipeId, { content, metadata }) {
  const maxStep = await pool.query(
    'SELECT COALESCE(MAX(step_number), 0) + 1 AS next_step FROM recipe_instruction WHERE recipe_id = $1',
    [recipeId]
  );
  const stepNumber = maxStep.rows[0].next_step;

  const result = await pool.query(
    `INSERT INTO recipe_instruction (recipe_id, step_number, content, metadata)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [recipeId, stepNumber, content, metadata || '{}']
  );

  await pool.query('UPDATE recipe SET updated_at = CURRENT_TIMESTAMP WHERE recipe_id = $1', [recipeId]);

  return result.rows[0];
}

// Update an instruction's content/metadata
async function updateInstruction(instructionId, recipeId, updateData) {
  const allowedFields = ['content', 'metadata'];

  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (updateData.hasOwnProperty(field)) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(updateData[field]);
      paramIndex++;
    }
  }

  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(instructionId);
  values.push(recipeId);

  const query = `
    UPDATE recipe_instruction
    SET ${updates.join(', ')}
    WHERE instruction_id = $${paramIndex} AND recipe_id = $${paramIndex + 1}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  if (result.rows.length > 0) {
    await pool.query('UPDATE recipe SET updated_at = CURRENT_TIMESTAMP WHERE recipe_id = $1', [recipeId]);
  }

  return result.rows[0];
}

// Remove an instruction and renumber remaining steps
async function removeInstruction(instructionId, recipeId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the step number of the instruction being deleted
    const instruction = await client.query(
      'SELECT step_number FROM recipe_instruction WHERE instruction_id = $1 AND recipe_id = $2',
      [instructionId, recipeId]
    );

    if (instruction.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const deletedStepNumber = instruction.rows[0].step_number;

    // Delete the instruction
    await client.query(
      'DELETE FROM recipe_instruction WHERE instruction_id = $1 AND recipe_id = $2',
      [instructionId, recipeId]
    );

    // Renumber remaining steps that come after the deleted one
    await client.query(
      `UPDATE recipe_instruction
       SET step_number = step_number - 1
       WHERE recipe_id = $1 AND step_number > $2`,
      [recipeId, deletedStepNumber]
    );

    await client.query('UPDATE recipe SET updated_at = CURRENT_TIMESTAMP WHERE recipe_id = $1', [recipeId]);

    await client.query('COMMIT');
    return { deleted: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Reorder instructions using two-phase approach to avoid unique constraint violations
async function reorderInstructions(recipeId, orderedIds) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verify all instruction IDs belong to this recipe
    const existing = await client.query(
      'SELECT instruction_id FROM recipe_instruction WHERE recipe_id = $1',
      [recipeId]
    );
    const existingIds = existing.rows.map(r => r.instruction_id);

    for (const id of orderedIds) {
      if (!existingIds.includes(id)) {
        await client.query('ROLLBACK');
        throw new Error(`Instruction ${id} does not belong to this recipe`);
      }
    }

    if (orderedIds.length !== existingIds.length) {
      await client.query('ROLLBACK');
      throw new Error('Must include all instruction IDs in the reorder');
    }

    // Phase 1: Set all to negative temporaries to avoid unique constraint violations
    for (let i = 0; i < orderedIds.length; i++) {
      await client.query(
        'UPDATE recipe_instruction SET step_number = $1 WHERE instruction_id = $2 AND recipe_id = $3',
        [-(i + 1), orderedIds[i], recipeId]
      );
    }

    // Phase 2: Set to positive final values
    for (let i = 0; i < orderedIds.length; i++) {
      await client.query(
        'UPDATE recipe_instruction SET step_number = $1 WHERE instruction_id = $2 AND recipe_id = $3',
        [i + 1, orderedIds[i], recipeId]
      );
    }

    await client.query('UPDATE recipe SET updated_at = CURRENT_TIMESTAMP WHERE recipe_id = $1', [recipeId]);

    await client.query('COMMIT');

    // Return the updated instructions
    const result = await pool.query(
      'SELECT * FROM recipe_instruction WHERE recipe_id = $1 ORDER BY step_number',
      [recipeId]
    );
    return result.rows;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// *************************************
// *     Availability Functions        *
// *************************************

// Check ingredient availability across all user pantries
async function checkAvailability(recipeId, userId) {
  const result = await pool.query(
    `SELECT
      ri.ingredient_id, ri.free_text, ri.product_id, ri.custom_product_id,
      ri.quantity AS recipe_quantity, ri.unit, ri.display_order,
      COALESCE(p.product_recipe_name, cp.product_recipe_name) AS product_recipe_name,
      CASE
        WHEN p.product_id IS NOT NULL THEN 'product'
        WHEN cp.custom_product_id IS NOT NULL THEN 'custom_product'
        ELSE NULL
      END AS product_type,
      COALESCE(inv.total_quantity, 0) AS available_quantity,
      CASE
        WHEN ri.product_id IS NULL AND ri.custom_product_id IS NULL THEN NULL
        WHEN COALESCE(inv.total_quantity, 0) > 0 THEN TRUE
        ELSE FALSE
      END AS is_available,
      inv.pantry_sources
    FROM recipe_ingredient ri
    LEFT JOIN product p ON ri.product_id = p.product_id
    LEFT JOIN custom_product cp ON ri.custom_product_id = cp.custom_product_id
    LEFT JOIN LATERAL (
      SELECT
        SUM(pp.quantity) AS total_quantity,
        json_agg(json_build_object(
          'pantry_id', pan.pantry_id,
          'pantry_recipe_name', pan.recipe_name,
          'quantity', pp.quantity
        )) AS pantry_sources
      FROM pantry_product pp
      JOIN pantry pan ON pp.pantry_id = pan.pantry_id
      WHERE pan.user_id = $2
      AND (
        (ri.product_id IS NOT NULL AND pp.product_id = ri.product_id)
        OR
        (ri.custom_product_id IS NOT NULL AND pp.custom_product_id = ri.custom_product_id)
      )
    ) inv ON TRUE
    WHERE ri.recipe_id = $1
    ORDER BY ri.display_order, ri.ingredient_id`,
    [recipeId, userId]
  );

  return result.rows;
}

module.exports = {
  // Recipe management
  verifyRecipeOwnership,
  createRecipe,
  getRecipesByUserId,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  // Ingredient management
  addIngredient,
  updateIngredient,
  removeIngredient,
  // Instruction management
  addInstruction,
  updateInstruction,
  removeInstruction,
  reorderInstructions,
  // Availability
  checkAvailability
};
