import { PaginateParams } from 'modules/common/types';
import { useEffect } from 'react';
import { ChangeEventHandler, useMemo, useState } from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';

interface Props {
  paginateParams?: PaginateParams;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  addOns?: React.ReactNode;
  isSearched?: boolean;
  onPageSizeChanged?: (pageSize: number) => void;
  onSearch?: (search: string) => void;
}

const Filter: React.FC<Props> = ({
  paginateParams,
  actions,
  filters,
  addOns,
  isSearched = true,
  onPageSizeChanged,
  onSearch,
}: Props) => {
  const optionsFilter = [10, 25, 50, 100];
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const handleSearch = () => {
    onSearch && onSearch(search || '');
  };

  useEffect(() => {
    setSearch(paginateParams?.search || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="d-md-flex mb-32 align-items-center">
        <div className="d-flex align-items-center mb-3 mb-md-0 mr-2">
          {onPageSizeChanged && (
            <div className="data-filter">
              <span className="caption__blue">Show</span>
              <Form className="ml-16">
                <Form.Control
                  as="select"
                  custom
                  onChange={(event) =>
                    onPageSizeChanged(parseInt(event.target.value))
                  }
                  value={paginateParams?.pageSize || 10}
                >
                  {optionsFilter.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </Form.Control>
              </Form>
              <span className="caption__blue ml-16">data</span>
            </div>
          )}
        </div>

        {actions}

        <div className="ml-auto mr-md-2 mb-3 mb-md-0 px-0">
          {filters && (
            <Button
              variant="primary"
              className="w-100 letter-spacing-2"
              onClick={() => setShowFilter((prevState) => !prevState)}
            >
              Filter
            </Button>
          )}

          {addOns}
        </div>

        {isSearched && (
          <>
            <InputGroup
              className={`form-group form-group--icon mb-0 w-auto ${
                filters ? 'ml-md-3' : 'ml-auto'
              }`}
            >
              <div className="w-100 position-relative">
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="basic-addon1"
                  value={search}
                  onChange={(event) => {
                    event.preventDefault();
                    setSearch(event.target.value);
                  }}
                />
                <InputGroup.Append>
                  <span className="input-group-text">
                    <div className="ic_search"></div>
                  </span>
                </InputGroup.Append>
              </div>
            </InputGroup>
            <div className="ml-md-2 mt-3 mt-md-0 pr-lg-25">
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </>
        )}
      </div>
      {showFilter && <div>{filters}</div>}
    </>
  );
};

export default Filter;
