const KeyVals = ({ items }) => (
  <table className='w-100'>
    <tbody>
      {
        items.filter(item => item).filter(([_, value]) => value != null).map(([label, value, options], index) => (
          <tr
            key={`${label}-${index}`}
            className={index % 2 ? '' : 'bg-light'}
          >
            <td
              className='pr-2'
              style={{
                width: '1%',
                whiteSpace: 'nowrap'
              }}
            >
              {label}:
            </td>
            <td>
              {
                options && options.link
                  ? (
                    <a
                      href={options.link}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {value}
                    </a>
                    )
                  : value
              }
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>
)

export default KeyVals
