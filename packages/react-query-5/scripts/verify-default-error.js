#!/usr/bin/env node

/**
 * Simple verification script to demonstrate DefaultError type overriding
 * This script validates that the types are correctly structured
 */

console.log('🔍 Verifying DefaultError type overriding implementation...\n')

// Check 1: Verify types file exists and has correct structure
try {
  const fs = require('fs')
  const path = require('path')
  
  const typesFile = path.join(__dirname, '../src/types.ts')
  const typesContent = fs.readFileSync(typesFile, 'utf8')
  
  console.log('✅ types.ts exists')
  
  // Check for Register interface
  if (typesContent.includes('export interface Register')) {
    console.log('✅ Register interface is exported')
  } else {
    console.log('❌ Register interface not found')
  }
  
  // Check for DefaultError type
  if (typesContent.includes('export type DefaultError')) {
    console.log('✅ DefaultError type is exported')
  } else {
    console.log('❌ DefaultError type not found')
  }
  
  // Check for correct type definition
  if (typesContent.includes("Register['defaultError']")) {
    console.log('✅ DefaultError uses Register interface correctly')
  } else {
    console.log('❌ DefaultError does not use Register interface')
  }
  
} catch (error) {
  console.log('❌ Error reading types.ts:', error.message)
}

console.log()

// Check 2: Verify index.ts exports the types
try {
  const fs = require('fs')
  const path = require('path')
  
  const indexFile = path.join(__dirname, '../src/index.ts')
  const indexContent = fs.readFileSync(indexFile, 'utf8')
  
  console.log('✅ index.ts exists')
  
  if (indexContent.includes("export type { DefaultError, Register } from './types'")) {
    console.log('✅ Types are exported from index.ts')
  } else {
    console.log('❌ Types are not properly exported from index.ts')
  }
  
} catch (error) {
  console.log('❌ Error reading index.ts:', error.message)
}

console.log()

// Check 3: Verify components use local DefaultError
try {
  const fs = require('fs')
  const path = require('path')
  
  const componentsToCheck = [
    'SuspenseQuery.tsx',
    'SuspenseInfiniteQuery.tsx', 
    'Mutation.tsx',
    'PrefetchQuery.tsx',
    'PrefetchInfiniteQuery.tsx'
  ]
  
  let allComponentsUpdated = true
  
  for (const component of componentsToCheck) {
    const componentFile = path.join(__dirname, '../src', component)
    const componentContent = fs.readFileSync(componentFile, 'utf8')
    
    // Check that component imports DefaultError from local types
    if (componentContent.includes("import type { DefaultError } from './types'")) {
      console.log(`✅ ${component} uses local DefaultError`)
    } else {
      console.log(`❌ ${component} does not use local DefaultError`)
      allComponentsUpdated = false
    }
    
    // Check that component doesn't import DefaultError from @tanstack/react-query
    if (componentContent.includes("type DefaultError") && 
        componentContent.includes("@tanstack/react-query")) {
      console.log(`❌ ${component} still imports DefaultError from @tanstack/react-query`)
      allComponentsUpdated = false
    }
  }
  
  if (allComponentsUpdated) {
    console.log('✅ All components properly updated')
  }
  
} catch (error) {
  console.log('❌ Error checking components:', error.message)
}

console.log()

// Check 4: Verify test file exists
try {
  const fs = require('fs')
  const path = require('path')
  
  const testFile = path.join(__dirname, '../src/DefaultError.test-d.tsx')
  const testContent = fs.readFileSync(testFile, 'utf8')
  
  console.log('✅ DefaultError.test-d.tsx exists')
  
  if (testContent.includes('declare module')) {
    console.log('✅ Test includes module augmentation example')
  } else {
    console.log('❌ Test does not include module augmentation example')
  }
  
} catch (error) {
  console.log('❌ Error reading test file:', error.message)
}

console.log()

// Summary
console.log('🎉 DefaultError type overriding implementation verification complete!')
console.log()
console.log('📖 Usage:')
console.log('   1. Create a types declaration file (e.g., types/react-query.d.ts)')
console.log('   2. Add module augmentation:')
console.log('      declare module "@suspensive/react-query" {')
console.log('        interface Register {')
console.log('          defaultError: YourCustomError')
console.log('        }')
console.log('      }')
console.log('   3. All Suspensive components will now use YourCustomError as default!')