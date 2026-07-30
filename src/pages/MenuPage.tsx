import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  CheckSquare,
  Square,
  RotateCcw,
  Save,
  Info,
  Shield,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';

export type NodeType = 'MENU' | 'GROUP' | 'LIST' | 'PERMISSION';

export interface MenuTreeNode {
  id: string;
  name: string;
  type: NodeType;
  sort: number;
  permission: string;
  path: string;
  children?: MenuTreeNode[];
  // Role permission map: roleKeyName -> boolean
  rolePermissions: Record<string, boolean>;
}

const INITIAL_MENU_TREE: MenuTreeNode[] = [
  {
    id: 'm-dashboard',
    name: 'Dashboard',
    type: 'MENU',
    sort: 1,
    permission: 'view_dashboard',
    path: 'dashboard',
    rolePermissions: {
      super_admin: true,
      admin: true,
      doctor: true,
      patient: true,
      staff: true,
      lead_pharmacist: true,
      staff_pharmacist: true,
      supplier: true,
    },
  },
  {
    id: 'm-inquiries',
    name: 'Inquiries',
    type: 'MENU',
    sort: 2,
    permission: 'view_inquiries',
    path: 'inquiry.index',
    rolePermissions: {
      super_admin: true,
      admin: true,
      doctor: true,
      patient: true,
      staff: true,
      lead_pharmacist: true,
      staff_pharmacist: true,
      supplier: false,
    },
    children: [
      {
        id: 'm-inquiry-list',
        name: 'List Inquiries',
        type: 'LIST',
        sort: 0,
        permission: 'list_inquiries',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: true,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: false,
        },
      },
      {
        id: 'm-inquiry-respond',
        name: 'Respond Inquiry',
        type: 'PERMISSION',
        sort: 1,
        permission: 'respond_inquiry',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: false,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: false,
        },
      },
      {
        id: 'm-inquiry-delete',
        name: 'Delete Inquiry',
        type: 'PERMISSION',
        sort: 2,
        permission: 'delete_inquiry',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: false,
          lead_pharmacist: false,
          staff_pharmacist: false,
          supplier: false,
        },
      },
    ],
  },
  {
    id: 'm-prescriptions',
    name: 'Prescriptions',
    type: 'MENU',
    sort: 3,
    permission: 'view_prescriptions',
    path: 'prescription.index',
    rolePermissions: {
      super_admin: true,
      admin: true,
      doctor: true,
      patient: true,
      staff: true,
      lead_pharmacist: true,
      staff_pharmacist: true,
      supplier: false,
    },
    children: [
      {
        id: 'm-rx-list',
        name: 'List Prescriptions',
        type: 'LIST',
        sort: 0,
        permission: 'list_prescriptions',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: true,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: false,
        },
      },
      {
        id: 'm-rx-refill',
        name: 'Request Refill',
        type: 'PERMISSION',
        sort: 1,
        permission: 'refill_request',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: true,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: false,
        },
      },
      {
        id: 'm-rx-approve',
        name: 'Approve Prescription',
        type: 'PERMISSION',
        sort: 2,
        permission: 'approve_prescription',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: false,
          staff: false,
          lead_pharmacist: true,
          staff_pharmacist: false,
          supplier: false,
        },
      },
      {
        id: 'm-rx-dispense',
        name: 'Dispense Medication',
        type: 'PERMISSION',
        sort: 3,
        permission: 'dispense_medication',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: false,
        },
      },
    ],
  },
  {
    id: 'm-medicine',
    name: 'Medicine',
    type: 'MENU',
    sort: 4,
    permission: 'view_medicine_module',
    path: 'medicine.index',
    rolePermissions: {
      super_admin: true,
      admin: true,
      doctor: true,
      patient: true,
      staff: true,
      lead_pharmacist: true,
      staff_pharmacist: true,
      supplier: true,
    },
    children: [
      {
        id: 'm-supplier',
        name: 'Supplier',
        type: 'MENU',
        sort: 1,
        permission: 'view_supplier',
        path: 'supplier.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: true,
        },
        children: [
          {
            id: 'm-supplier-list',
            name: 'List Suppliers',
            type: 'LIST',
            sort: 0,
            permission: 'list_supplier',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: true,
              supplier: true,
            },
          },
          {
            id: 'm-supplier-create',
            name: 'Create Supplier',
            type: 'PERMISSION',
            sort: 1,
            permission: 'create_supplier',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
        ],
      },
      {
        id: 'm-manufacturer',
        name: 'Manufacturer',
        type: 'MENU',
        sort: 2,
        permission: 'view_manufacturer',
        path: 'manufacturer.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: true,
        },
        children: [
          {
            id: 'm-manufacturer-list',
            name: 'List Manufacturers',
            type: 'LIST',
            sort: 0,
            permission: 'list_manufacturer',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: true,
              supplier: true,
            },
          },
          {
            id: 'm-manufacturer-create',
            name: 'Create Manufacturer',
            type: 'PERMISSION',
            sort: 1,
            permission: 'create_manufacturer',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
        ],
      },
      {
        id: 'm-medicine-item',
        name: 'Medicine',
        type: 'MENU',
        sort: 3,
        permission: 'view_medicine',
        path: 'medicine.item.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: true,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: true,
        },
        children: [
          {
            id: 'm-medicine-list',
            name: 'List Medicines',
            type: 'LIST',
            sort: 0,
            permission: 'list_medicine',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: true,
              patient: true,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: true,
              supplier: true,
            },
          },
          {
            id: 'm-medicine-create',
            name: 'Create Medicine',
            type: 'PERMISSION',
            sort: 1,
            permission: 'create_medicine',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: true,
              supplier: false,
            },
          },
        ],
      },
      {
        id: 'm-stock-history',
        name: 'Stock History',
        type: 'MENU',
        sort: 4,
        permission: 'view_stock_history',
        path: 'stock_history.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: true,
        },
        children: [
          {
            id: 'm-stock-list',
            name: 'List Stock History',
            type: 'LIST',
            sort: 0,
            permission: 'list_stock_history',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: true,
              supplier: true,
            },
          },
          {
            id: 'm-stock-export',
            name: 'Export Stock Audit',
            type: 'PERMISSION',
            sort: 1,
            permission: 'export_stock',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: true,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'm-configuration',
    name: 'Configuration',
    type: 'GROUP',
    sort: 4,
    permission: 'view_configuration',
    path: '--',
    rolePermissions: {
      super_admin: true,
      admin: true,
      doctor: false,
      patient: false,
      staff: false,
      lead_pharmacist: true,
      staff_pharmacist: false,
      supplier: false,
    },
    children: [
      {
        id: 'm-menu',
        name: 'Menu',
        type: 'MENU',
        sort: 1,
        permission: 'view_menu',
        path: 'menu.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: false,
          lead_pharmacist: false,
          staff_pharmacist: false,
          supplier: false,
        },
        children: [
          {
            id: 'm-menu-list',
            name: 'List Menu Matrix',
            type: 'LIST',
            sort: 0,
            permission: 'list_menu',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: false,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-menu-edit',
            name: 'Edit Menu Matrix',
            type: 'PERMISSION',
            sort: 1,
            permission: 'edit_menu',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: false,
              staff_pharmacist: false,
              supplier: false,
            },
          },
        ],
      },
      {
        id: 'm-roles',
        name: 'Roles',
        type: 'MENU',
        sort: 2,
        permission: 'view_role',
        path: 'role.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: false,
          lead_pharmacist: true,
          staff_pharmacist: false,
          supplier: false,
        },
        children: [
          {
            id: 'm-roles-list',
            name: 'List Roles',
            type: 'LIST',
            sort: 0,
            permission: 'list_role',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-roles-create',
            name: 'Create Role',
            type: 'PERMISSION',
            sort: 1,
            permission: 'create_role',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-roles-edit',
            name: 'Edit Role',
            type: 'PERMISSION',
            sort: 2,
            permission: 'edit_role',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-roles-delete',
            name: 'Delete Role',
            type: 'PERMISSION',
            sort: 3,
            permission: 'delete_role',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: false,
              staff_pharmacist: false,
              supplier: false,
            },
          },
        ],
      },
      {
        id: 'm-user',
        name: 'User',
        type: 'MENU',
        sort: 3,
        permission: 'view_user',
        path: 'user.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: false,
          lead_pharmacist: true,
          staff_pharmacist: false,
          supplier: false,
        },
        children: [
          {
            id: 'm-user-list',
            name: 'List Users',
            type: 'LIST',
            sort: 0,
            permission: 'list_user',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-user-create',
            name: 'Create User',
            type: 'PERMISSION',
            sort: 1,
            permission: 'create_user',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-user-edit',
            name: 'Edit User',
            type: 'PERMISSION',
            sort: 2,
            permission: 'edit_user',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-user-delete',
            name: 'Delete User',
            type: 'PERMISSION',
            sort: 3,
            permission: 'delete_user',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: false,
              staff_pharmacist: false,
              supplier: false,
            },
          },
        ],
      },
      {
        id: 'm-security',
        name: 'Security & 2FA',
        type: 'MENU',
        sort: 4,
        permission: 'view_security',
        path: 'security.index',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: false,
          patient: false,
          staff: false,
          lead_pharmacist: true,
          staff_pharmacist: false,
          supplier: false,
        },
        children: [
          {
            id: 'm-sec-logs',
            name: 'View Security Logs',
            type: 'LIST',
            sort: 0,
            permission: 'view_logs',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-sec-2fa',
            name: 'Configure 2FA Settings',
            type: 'PERMISSION',
            sort: 1,
            permission: 'config_2fa',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: true,
              staff_pharmacist: false,
              supplier: false,
            },
          },
          {
            id: 'm-sec-export',
            name: 'Export Audit Trail',
            type: 'PERMISSION',
            sort: 2,
            permission: 'export_logs',
            path: '--',
            rolePermissions: {
              super_admin: true,
              admin: true,
              doctor: false,
              patient: false,
              staff: false,
              lead_pharmacist: false,
              staff_pharmacist: false,
              supplier: false,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'm-profile',
    name: 'Profile & Account',
    type: 'MENU',
    sort: 5,
    permission: 'view_profile',
    path: 'profile.index',
    rolePermissions: {
      super_admin: true,
      admin: true,
      doctor: true,
      patient: true,
      staff: true,
      lead_pharmacist: true,
      staff_pharmacist: true,
      supplier: true,
    },
    children: [
      {
        id: 'm-profile-view',
        name: 'View Account Details',
        type: 'LIST',
        sort: 0,
        permission: 'view_account',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: true,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: true,
        },
      },
      {
        id: 'm-profile-pass',
        name: 'Update Password',
        type: 'PERMISSION',
        sort: 1,
        permission: 'update_password',
        path: '--',
        rolePermissions: {
          super_admin: true,
          admin: true,
          doctor: true,
          patient: true,
          staff: true,
          lead_pharmacist: true,
          staff_pharmacist: true,
          supplier: true,
        },
      },
    ],
  },
];

export const MenuPage: React.FC = () => {
  const { roles } = useData();

  // Selected visible roles in "SHOW ROLES" filter bar
  const [visibleRoleKeys, setVisibleRoleKeys] = useState<string[]>([
    'super_admin',
    'admin',
    'doctor',
    'patient',
    'staff',
  ]);

  // Menu tree state
  const [treeData, setTreeData] = useState<MenuTreeNode[]>(INITIAL_MENU_TREE);

  // Expanded tree node IDs (initially all collapsed)
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all node IDs recursively helper
  const getAllNodeIds = (nodes: MenuTreeNode[]): string[] => {
    let ids: string[] = [];
    nodes.forEach(node => {
      ids.push(node.id);
      if (node.children && node.children.length > 0) {
        ids = ids.concat(getAllNodeIds(node.children));
      }
    });
    return ids;
  };

  const handleExpandAll = () => {
    const allIds = getAllNodeIds(treeData);
    setExpandedNodeIds(new Set(allIds));
    toast.info('Expanded all menu items.');
  };

  const handleCollapseAll = () => {
    setExpandedNodeIds(new Set());
    toast.info('Collapsed all menu items.');
  };

  const handleReset = () => {
    setTreeData(INITIAL_MENU_TREE);
    setVisibleRoleKeys(['super_admin', 'admin', 'doctor', 'patient', 'staff']);
    setExpandedNodeIds(new Set());
    toast.success('Reset menu matrix to default state.');
  };

  const handleSave = () => {
    toast.success('Menu permissions matrix saved successfully!');
  };

  // Toggle node expansion
  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Toggle role checkbox for a node recursively
  const toggleRolePermission = (nodeId: string, roleKey: string) => {
    if (roleKey === 'super_admin') return; // Locked

    const updateRecursive = (nodes: MenuTreeNode[]): MenuTreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          const currentVal = !!node.rolePermissions[roleKey];
          const updatedVal = !currentVal;
          const newRolePerms = { ...node.rolePermissions, [roleKey]: updatedVal };

          let updatedChildren = node.children;
          if (node.children && node.children.length > 0) {
            updatedChildren = updateAllChildren(node.children, roleKey, updatedVal);
          }

          return {
            ...node,
            rolePermissions: newRolePerms,
            children: updatedChildren,
          };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: updateRecursive(node.children),
          };
        }
        return node;
      });
    };

    const updateAllChildren = (
      children: MenuTreeNode[],
      rKey: string,
      val: boolean
    ): MenuTreeNode[] => {
      return children.map(child => ({
        ...child,
        rolePermissions: { ...child.rolePermissions, [rKey]: val },
        children: child.children ? updateAllChildren(child.children, rKey, val) : undefined,
      }));
    };

    setTreeData(prev => updateRecursive(prev));
  };

  // Toggle role column visibility
  const toggleRoleVisibility = (roleKey: string) => {
    if (roleKey === 'super_admin') return; // Keep super_admin visible
    setVisibleRoleKeys(prev =>
      prev.includes(roleKey) ? prev.filter(k => k !== roleKey) : [...prev, roleKey]
    );
  };

  // Flattened tree nodes for table rendering
  const renderFlatRows = useMemo(() => {
    const flat: { node: MenuTreeNode; level: number; hasChildren: boolean; isExpanded: boolean }[] = [];

    const traverse = (nodes: MenuTreeNode[], level: number) => {
      nodes.forEach(node => {
        const hasChildren = !!(node.children && node.children.length > 0);
        const isExpanded = expandedNodeIds.has(node.id);

        // Filter check
        const matchesQuery =
          searchQuery.trim() === '' ||
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.permission.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.path.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesQuery) {
          flat.push({ node, level, hasChildren, isExpanded });
        }

        if (hasChildren && (isExpanded || searchQuery.trim() !== '')) {
          traverse(node.children!, level + 1);
        }
      });
    };

    traverse(treeData, 0);
    return flat;
  }, [treeData, expandedNodeIds, searchQuery]);

  // Badge Color Mapper (Responsive for Light & Dark mode)
  const renderBadge = (type: NodeType) => {
    switch (type) {
      case 'MENU':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            MENU
          </span>
        );
      case 'GROUP':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-blue-600/10 dark:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-500/30 dark:border-blue-500/40">
            GROUP
          </span>
        );
      case 'LIST':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            LIST
          </span>
        );
      case 'PERMISSION':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            PERMISSION
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar - SHOW ROLES Selector (Responsive Light & Dark Mode) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-xl space-y-3 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              SHOW ROLES
            </span>
          </div>

          {/* Dynamic Role Pills Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {roles.map(r => {
              const roleKey = r.keyName;
              const isSuperAdmin = roleKey === 'super_admin';
              const isChecked = visibleRoleKeys.includes(roleKey);

              return (
                <button
                  key={r.id}
                  onClick={() => toggleRoleVisibility(roleKey)}
                  disabled={isSuperAdmin}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-blue-600 text-white shadow-xs border border-blue-500 dark:border-blue-400'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${isSuperAdmin ? 'cursor-not-allowed opacity-90' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    disabled={isSuperAdmin}
                    className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
                  />
                  <span>{r.displayName}{isSuperAdmin ? '*' : ''}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend / Help Banner - Modern Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Menu Card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 transition-colors">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 shrink-0 mt-0.5">
              MENU
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Sidebar Navigation</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">Controls sidebar link and page access.</span>
            </div>
          </div>

          {/* List Card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 transition-colors">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              LIST
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Data Records</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">Allows viewing rows in the table.</span>
            </div>
          </div>

          {/* Permission Card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 transition-colors">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shrink-0 mt-0.5">
              PERMISSION
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Actions & Operations</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">Create, Edit, Delete, Export permissions.</span>
            </div>
          </div>
        </div>

        {/* Tip / Note Box */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-200">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong className="font-semibold text-blue-700 dark:text-blue-300">Tip:</strong> Check <strong>MENU + LIST</strong> to allow viewing a page and its table rows without edit/delete privileges. Super Admin (*) permissions are locked.
          </span>
        </div>
      </div>

      {/* Real-time Search Filter Bar & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search menu name, permission key, or path..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#111c38] border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 h-10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={handleExpandAll}
            className="px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Expand all
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Collapse all
          </button>
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Permissions Matrix Table Container (Fully Responsive for Light & Dark Mode) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 shadow-md dark:shadow-2xl transition-colors">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800/90 bg-slate-100/90 dark:bg-[#070d1e] text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <th className="py-3.5 px-4 min-w-[240px]">MENU</th>
              <th className="py-3.5 px-4 w-20 text-center">SORT</th>
              {/* Dynamically Render Header Columns for Visible Roles */}
              {roles
                .filter(r => visibleRoleKeys.includes(r.keyName))
                .map(r => (
                  <th key={r.id} className="py-3.5 px-3 text-center whitespace-nowrap min-w-[100px]">
                    <span className="truncate max-w-[110px] inline-block font-extrabold text-slate-800 dark:text-slate-200">
                      {r.displayName.toUpperCase()}
                      {r.keyName === 'super_admin' ? '*' : ''}
                    </span>
                  </th>
                ))}
              <th className="py-3.5 px-4 min-w-[180px]">PERMISSION</th>
              <th className="py-3.5 px-4 min-w-[120px]">PATH</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {renderFlatRows.length === 0 ? (
              <tr>
                <td
                  colSpan={4 + visibleRoleKeys.length}
                  className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs"
                >
                  No menu items matched your search query.
                </td>
              </tr>
            ) : (
              renderFlatRows.map(({ node, level, hasChildren, isExpanded }) => {
                return (
                  <tr
                    key={node.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group text-slate-800 dark:text-slate-200"
                  >
                    {/* MENU TREE COLUMN */}
                    <td className="py-3 px-4">
                      <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${level * 20}px` }}
                      >
                        {hasChildren ? (
                          <button
                            onClick={() => toggleNodeExpand(node.id)}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="w-5" />
                        )}

                        <span className="font-semibold text-xs text-slate-900 dark:text-white tracking-tight">
                          {node.name}
                        </span>

                        {renderBadge(node.type)}
                      </div>
                    </td>

                    {/* SORT COLUMN */}
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                        {node.sort}
                      </span>
                    </td>

                    {/* ROLE CHECKBOX COLUMNS */}
                    {roles
                      .filter(r => visibleRoleKeys.includes(r.keyName))
                      .map(r => {
                        const roleKey = r.keyName;
                        const isSuperAdmin = roleKey === 'super_admin';
                        const isChecked = isSuperAdmin ? true : !!node.rolePermissions[roleKey];

                        return (
                          <td key={r.id} className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleRolePermission(node.id, roleKey)}
                              disabled={isSuperAdmin}
                              className={`p-1 rounded-md transition-all cursor-pointer inline-flex items-center justify-center ${
                                isSuperAdmin
                                  ? 'cursor-not-allowed opacity-90 text-blue-600 dark:text-blue-400'
                                  : isChecked
                                  ? 'text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300'
                                  : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
                              }`}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        );
                      })}

                    {/* PERMISSION CODE COLUMN */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {node.permission}
                    </td>

                    {/* PATH COLUMN */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {node.path}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
