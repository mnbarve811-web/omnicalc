import { describe, it, expect } from 'vitest'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Table } from '@/components/ui/table'
import { Tabs } from '@/components/ui/tabs'
import { Accordion } from '@/components/ui/accordion'

describe('shadcn/ui imports', () => {
  it('all 7 primitives import without error', () => {
    expect(Input).toBeDefined()
    expect(Button).toBeDefined()
    expect(Slider).toBeDefined()
    expect(Card).toBeDefined()
    expect(Table).toBeDefined()
    expect(Tabs).toBeDefined()
    expect(Accordion).toBeDefined()
  })
})
