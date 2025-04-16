export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      GitHubDocFilePath: {
        Row: {
          createdAt: string
          id: string
          isReviewEnabled: boolean
          path: string
          projectId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: string
          isReviewEnabled?: boolean
          path: string
          projectId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          isReviewEnabled?: boolean
          path?: string
          projectId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'GitHubDocFilePath_projectId_fkey'
            columns: ['projectId']
            isOneToOne: false
            referencedRelation: 'Project'
            referencedColumns: ['id']
          },
        ]
      }
      GitHubSchemaFilePath: {
        Row: {
          createdAt: string
          format: Database['public']['Enums']['SchemaFormatEnum']
          id: string
          path: string
          projectId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          format: Database['public']['Enums']['SchemaFormatEnum']
          id?: string
          path: string
          projectId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          format?: Database['public']['Enums']['SchemaFormatEnum']
          id?: string
          path?: string
          projectId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'GitHubSchemaFilePath_projectId_fkey'
            columns: ['projectId']
            isOneToOne: false
            referencedRelation: 'Project'
            referencedColumns: ['id']
          },
        ]
      }
      KnowledgeSuggestion: {
        Row: {
          approvedAt: string | null
          branchName: string
          content: string
          createdAt: string
          fileSha: string | null
          id: string
          path: string
          projectId: string
          reasoning: string | null
          title: string
          traceId: string | null
          type: Database['public']['Enums']['KnowledgeType']
          updatedAt: string
        }
        Insert: {
          approvedAt?: string | null
          branchName: string
          content: string
          createdAt?: string
          fileSha?: string | null
          id?: string
          path: string
          projectId: string
          reasoning?: string | null
          title: string
          traceId?: string | null
          type: Database['public']['Enums']['KnowledgeType']
          updatedAt: string
        }
        Update: {
          approvedAt?: string | null
          branchName?: string
          content?: string
          createdAt?: string
          fileSha?: string | null
          id?: string
          path?: string
          projectId?: string
          reasoning?: string | null
          title?: string
          traceId?: string | null
          type?: Database['public']['Enums']['KnowledgeType']
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'KnowledgeSuggestion_projectId_fkey'
            columns: ['projectId']
            isOneToOne: false
            referencedRelation: 'Project'
            referencedColumns: ['id']
          },
        ]
      }
      KnowledgeSuggestionDocMapping: {
        Row: {
          createdAt: string
          gitHubDocFilePathId: string
          id: string
          knowledgeSuggestionId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          gitHubDocFilePathId: string
          id?: string
          knowledgeSuggestionId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          gitHubDocFilePathId?: string
          id?: string
          knowledgeSuggestionId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'KnowledgeSuggestionDocMapping_gitHubDocFilePathId_fkey'
            columns: ['gitHubDocFilePathId']
            isOneToOne: false
            referencedRelation: 'GitHubDocFilePath'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'KnowledgeSuggestionDocMapping_knowledgeSuggestionId_fkey'
            columns: ['knowledgeSuggestionId']
            isOneToOne: false
            referencedRelation: 'KnowledgeSuggestion'
            referencedColumns: ['id']
          },
        ]
      }
      MembershipInvites: {
        Row: {
          email: string
          id: string
          inviteByUserId: string
          invitedAt: string | null
          organizationId: string
        }
        Insert: {
          email: string
          id?: string
          inviteByUserId: string
          invitedAt?: string | null
          organizationId: string
        }
        Update: {
          email?: string
          id?: string
          inviteByUserId?: string
          invitedAt?: string | null
          organizationId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'MembershipInvites_inviteByUserId_fkey'
            columns: ['inviteByUserId']
            isOneToOne: false
            referencedRelation: 'User'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'MembershipInvites_organizationId_fkey'
            columns: ['organizationId']
            isOneToOne: false
            referencedRelation: 'Organization'
            referencedColumns: ['id']
          },
        ]
      }
      Migration: {
        Row: {
          createdAt: string
          id: string
          pullRequestId: string
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: string
          pullRequestId: string
          title: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          pullRequestId?: string
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'Migration_pullRequestId_fkey'
            columns: ['pullRequestId']
            isOneToOne: false
            referencedRelation: 'PullRequest'
            referencedColumns: ['id']
          },
        ]
      }
      Organization: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      OrganizationMember: {
        Row: {
          id: string
          joinedAt: string | null
          organizationId: string
          userId: string
        }
        Insert: {
          id?: string
          joinedAt?: string | null
          organizationId: string
          userId: string
        }
        Update: {
          id?: string
          joinedAt?: string | null
          organizationId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'OrganizationMember_organizationId_fkey'
            columns: ['organizationId']
            isOneToOne: false
            referencedRelation: 'Organization'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'OrganizationMember_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'User'
            referencedColumns: ['id']
          },
        ]
      }
      OverallReview: {
        Row: {
          branchName: string
          createdAt: string
          id: string
          projectId: string | null
          pullRequestId: string
          reviewComment: string | null
          reviewedAt: string
          traceId: string | null
          updatedAt: string
        }
        Insert: {
          branchName: string
          createdAt?: string
          id?: string
          projectId?: string | null
          pullRequestId: string
          reviewComment?: string | null
          reviewedAt?: string
          traceId?: string | null
          updatedAt: string
        }
        Update: {
          branchName?: string
          createdAt?: string
          id?: string
          projectId?: string | null
          pullRequestId?: string
          reviewComment?: string | null
          reviewedAt?: string
          traceId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'OverallReview_projectId_fkey'
            columns: ['projectId']
            isOneToOne: false
            referencedRelation: 'Project'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'OverallReview_pullRequestId_fkey'
            columns: ['pullRequestId']
            isOneToOne: false
            referencedRelation: 'PullRequest'
            referencedColumns: ['id']
          },
        ]
      }
      OverallReviewKnowledgeSuggestionMapping: {
        Row: {
          createdAt: string
          id: string
          knowledgeSuggestionId: string
          overallReviewId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: string
          knowledgeSuggestionId: string
          overallReviewId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          knowledgeSuggestionId?: string
          overallReviewId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'OverallReviewKnowledgeSuggestionMapping_knowledgeSuggestionId_f'
            columns: ['knowledgeSuggestionId']
            isOneToOne: false
            referencedRelation: 'KnowledgeSuggestion'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'OverallReviewKnowledgeSuggestionMapping_overallReviewId_fkey'
            columns: ['overallReviewId']
            isOneToOne: false
            referencedRelation: 'OverallReview'
            referencedColumns: ['id']
          },
        ]
      }
      Project: {
        Row: {
          createdAt: string
          id: string
          name: string
          organizationId: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
          organizationId?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          organizationId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'Project_organizationId_fkey'
            columns: ['organizationId']
            isOneToOne: false
            referencedRelation: 'Organization'
            referencedColumns: ['id']
          },
        ]
      }
      ProjectRepositoryMapping: {
        Row: {
          createdAt: string
          id: string
          projectId: string
          repositoryId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: string
          projectId: string
          repositoryId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          projectId?: string
          repositoryId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ProjectRepositoryMapping_projectId_fkey'
            columns: ['projectId']
            isOneToOne: false
            referencedRelation: 'Project'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ProjectRepositoryMapping_repositoryId_fkey'
            columns: ['repositoryId']
            isOneToOne: false
            referencedRelation: 'Repository'
            referencedColumns: ['id']
          },
        ]
      }
      PullRequest: {
        Row: {
          commentId: number | null
          createdAt: string
          id: string
          pullNumber: number
          repositoryId: string
          updatedAt: string
        }
        Insert: {
          commentId?: number | null
          createdAt?: string
          id?: string
          pullNumber: number
          repositoryId: string
          updatedAt: string
        }
        Update: {
          commentId?: number | null
          createdAt?: string
          id?: string
          pullNumber?: number
          repositoryId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'PullRequest_repositoryId_fkey'
            columns: ['repositoryId']
            isOneToOne: false
            referencedRelation: 'Repository'
            referencedColumns: ['id']
          },
        ]
      }
      Repository: {
        Row: {
          createdAt: string
          id: string
          installationId: number
          isActive: boolean
          name: string
          owner: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: string
          installationId: number
          isActive?: boolean
          name: string
          owner: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          installationId?: number
          isActive?: boolean
          name?: string
          owner?: string
          updatedAt?: string
        }
        Relationships: []
      }
      ReviewFeedback: {
        Row: {
          category: Database['public']['Enums']['CategoryEnum']
          createdAt: string
          description: string
          id: string
          overallReviewId: string
          resolutionComment: string | null
          resolvedAt: string | null
          severity: Database['public']['Enums']['SeverityEnum']
          suggestion: string
          updatedAt: string
        }
        Insert: {
          category: Database['public']['Enums']['CategoryEnum']
          createdAt?: string
          description: string
          id?: string
          overallReviewId: string
          resolutionComment?: string | null
          resolvedAt?: string | null
          severity: Database['public']['Enums']['SeverityEnum']
          suggestion: string
          updatedAt: string
        }
        Update: {
          category?: Database['public']['Enums']['CategoryEnum']
          createdAt?: string
          description?: string
          id?: string
          overallReviewId?: string
          resolutionComment?: string | null
          resolvedAt?: string | null
          severity?: Database['public']['Enums']['SeverityEnum']
          suggestion?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ReviewFeedback_overallReviewId_fkey'
            columns: ['overallReviewId']
            isOneToOne: false
            referencedRelation: 'OverallReview'
            referencedColumns: ['id']
          },
        ]
      }
      ReviewFeedbackComment: {
        Row: {
          content: string
          createdAt: string
          id: string
          reviewFeedbackId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id?: string
          reviewFeedbackId: string
          updatedAt: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          reviewFeedbackId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ReviewFeedbackComment_reviewFeedbackId_fkey'
            columns: ['reviewFeedbackId']
            isOneToOne: false
            referencedRelation: 'ReviewFeedback'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ReviewFeedbackComment_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'User'
            referencedColumns: ['id']
          },
        ]
      }
      ReviewSuggestionSnippet: {
        Row: {
          createdAt: string
          filename: string
          id: string
          reviewFeedbackId: string
          snippet: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          filename: string
          id?: string
          reviewFeedbackId: string
          snippet: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          filename?: string
          id?: string
          reviewFeedbackId?: string
          snippet?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ReviewSuggestionSnippet_reviewFeedbackId_fkey'
            columns: ['reviewFeedbackId']
            isOneToOne: false
            referencedRelation: 'ReviewFeedback'
            referencedColumns: ['id']
          },
        ]
      }
      User: {
        Row: {
          email: string
          id: string
          name: string
        }
        Insert: {
          email: string
          id: string
          name: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      sync_existing_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      CategoryEnum:
        | 'MIGRATION_SAFETY'
        | 'DATA_INTEGRITY'
        | 'PERFORMANCE_IMPACT'
        | 'PROJECT_RULES_CONSISTENCY'
        | 'SECURITY_OR_SCALABILITY'
      KnowledgeType: 'SCHEMA' | 'DOCS'
      SchemaFormatEnum: 'schemarb' | 'postgres' | 'prisma' | 'tbls'
      SeverityEnum: 'CRITICAL' | 'WARNING' | 'POSITIVE' | 'QUESTION'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      CategoryEnum: [
        'MIGRATION_SAFETY',
        'DATA_INTEGRITY',
        'PERFORMANCE_IMPACT',
        'PROJECT_RULES_CONSISTENCY',
        'SECURITY_OR_SCALABILITY',
      ],
      KnowledgeType: ['SCHEMA', 'DOCS'],
      SchemaFormatEnum: ['schemarb', 'postgres', 'prisma', 'tbls'],
      SeverityEnum: ['CRITICAL', 'WARNING', 'POSITIVE', 'QUESTION'],
    },
  },
} as const
