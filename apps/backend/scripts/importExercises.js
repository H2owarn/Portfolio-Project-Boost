const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

// load env vars
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // 1. Fetch the JSON data from GitHub
  const { data } = await axios.get(
    'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
  );

  console.log(`Fetched ${data.length} exercises`);

  // 2. Insert in batches
  const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize).map((ex) => ({
        external_id: ex.id,
        name: ex.name,
        force: ex.force,
        level: ex.level,
        mechanic: ex.mechanic,
        equipment: ex.equipment,
        primary_muscles: ex.primaryMuscles,
        secondary_muscles: ex.secondaryMuscles,
        instructions: ex.instructions,
        category: ex.category,
        images: ex.images.map(
          (img) =>
            `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`
        ),
      }));

    const { error } = await supabase.from('exercises').insert(batch);
    if (error) {
      console.error('❌ Error inserting batch:', error.message);
    } else {
      console.log(`✅ Inserted ${i + batch.length} / ${data.length}`);
    }
  }

  console.log('🎉 Import complete');
}

run().catch(console.error);
