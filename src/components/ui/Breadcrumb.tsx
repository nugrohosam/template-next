import { Breadcrumb } from 'react-bootstrap';

export interface PathBreadcrumb {
  label: string;
  link?: string;
  active?: boolean;
}

export interface AppBreadcrumbs {
  paths: PathBreadcrumb[];
}

const BreadCrumbs: React.FC<AppBreadcrumbs> = ({ paths }: AppBreadcrumbs) => {
  return (
    <Breadcrumb className="ml-auto">
      {paths?.map((path, index) => (
        <Breadcrumb.Item
          href={`${path.link}`}
          key={index}
          className="breadcrumb--item"
          active={path.active}
        >
          {path.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadCrumbs;
