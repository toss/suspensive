import type { ComponentProps } from 'react'

export function Thead({ children, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      {...props}
      className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
    >
      {children}
    </thead>
  )
}

export function Tbody({ children, ...props }: ComponentProps<'tbody'>) {
  return <tbody {...props}>{children}</tbody>
}

export function Tr({ children, ...props }: ComponentProps<'tr'>) {
  return (
    <tr {...props} className="border-b border-gray-200 dark:border-gray-800">
      {children}
    </tr>
  )
}

export function Th({ children, ...props }: ComponentProps<'th'>) {
  return (
    <th
      {...props}
      className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100"
    >
      {children}
    </th>
  )
}

export function Td({ children, ...props }: ComponentProps<'td'>) {
  return (
    <td {...props} className="px-4 py-3 text-gray-700 dark:text-gray-300">
      {children}
    </td>
  )
}

function TableComponent({ children, ...props }: ComponentProps<'table'>) {
  return (
    <div className="my-6 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  )
}

// Add namespace pattern support for <Table.Tr>, <Table.Th>, etc.
TableComponent.Thead = Thead
TableComponent.Tbody = Tbody
TableComponent.Tr = Tr
TableComponent.Th = Th
TableComponent.Td = Td

export const Table = TableComponent
