import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResultHero } from '@/components/common/Result'

describe('ResultHero', () => {
  it('announces only the label and value, not the breakdown beneath them', () => {
    const { container } = render(
      <ResultHero label="Total Monthly" value="$2,549" caption="Estimated monthly housing cost">
        <span>Principal & interest $2,129 84%</span>
      </ResultHero>
    )
    const liveRegions = container.querySelectorAll('[aria-live]')
    expect(liveRegions).toHaveLength(1)
    expect(liveRegions[0].textContent).toBe('Total Monthly$2,549')
  })
})
