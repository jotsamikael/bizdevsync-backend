module.exports = {
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          email: { type: 'string' },
          avatar: { type: 'string' },
          is_activated: { type: 'boolean' },
          is_verified: { type: 'boolean' },
          role: { type: 'string' },
          will_expire: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          Enterprise_idEnterprise: { type: 'integer', nullable: true },
          plan_id: { type: 'integer' },
          telephone: { type: 'string', nullable: true  },
          last_ip: { type: 'string', nullable: true  },
          last_login: { type: 'string', nullable: true,format: 'date-time'  },
          last_activity: { type: 'string', nullable: true,format: 'date-time'  },
          google_auth_secret: { type: 'string', nullable: true  },
          email_signature: { type: 'string', nullable: true  },
          default_language: { type: 'string', nullable: true  },
          linkedIn: { type: 'string', nullable: true  },

        }
      },
       Lead: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        status: {
          type: 'string',
          enum: ['UNQUALIFIED', 'QUALIFIED', 'CONVERTED']
        },
        id: { type: 'integer' },
        description: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        creator:{
          first_name:{ type: 'string' }
        },
         Country:{
          short_name:{ type: 'string' }
        },
         Source:{
          label:{ type: 'string' }
        },
        website: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        country: { type: 'integer', nullable: true },
        assigned_to_user_id: { type: 'integer', nullable: true },
        telephone: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
        town: { type: 'string', nullable: true },
        tags: { type: 'string', nullable: true },
        activitySector: { type: 'string' },
        is_private: { type: 'boolean' },
        lead_value: { type: 'integer', nullable: true },
        last_activity:{ type: 'string', nullable: true,format: 'date-time'}, 
        date_assigned:{type: 'string', nullable: true,format: 'date-time'},
        last_status_change:{type: 'string', nullable: true,format: 'date-time'},
        date_converted:{type: 'string', nullable: true,format: 'date-time'}
      }
    },
    Activity: {
      type: 'object',
      properties: {
        idActivity: { type: 'integer' },
        title: { type: 'string', nullable: true },
        detail: { type: 'string', nullable: true },
        status: {
          type: 'string',
          enum: ['COMPLETED', 'PENDING', 'IN_PROGRESS', 'NOT_STARTED', 'WAITING_FEEDBACK']
        },
        start_date: { type: 'string', format: 'date-time' },
        due_date: { type: 'string', format: 'date-time' },
        end_date: { type: 'string', format: 'date-time', nullable: true },
        tags: { type: 'string', nullable: true },
        priority: {
          type: 'string',
          enum: ['CRITICAL', 'IMPORTANT', 'HIGH', 'MEDIUM', 'LOW']
        },
        last_action: { type: 'string', nullable: true },
        last_action_date: { type: 'string', format: 'date-time', nullable: true },
        next_action: { type: 'string', nullable: true },
        next_action_date: { type: 'string', format: 'date-time', nullable: true },
        _idFollowup: { type: 'integer', nullable: true },
        _idBusiness: { type: 'integer', nullable: true },
      }
    },
    Meeting: {
      type: 'object',
      properties: {
        idMeeting: { type: 'integer' },
        title: { type: 'string', nullable: false },
        status: {
          type: 'string',
          enum: ['COMPLETED', 'PENDING', 'IN_PROGRESS', 'NOT STARTED', 'WAITING FEEDBACK']
        },
        due_date: { type: 'string', format: 'date-time' },
        summary: { type: 'string' },
        next_action: { type: 'string' },
        next_action_date: { type: 'string', format: 'date-time', nullable: true },
        _idFollowup: { type: 'integer', nullable: true },
        _idBusiness: { type: 'integer', nullable: true },
      }
    },
    Contact: {
      type: 'object',
      properties: {
        idContact: { type: 'integer' },
        assignedToUser: { type: 'integer' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        position: { type: 'string', nullable: true },
        language: {
          type: 'string',
          nullable: false 
        },
        notes: { type: 'string', nullable: true },
      }
    },
    Product: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        product_category_id: { type: 'integer' },
        short_description: { type: 'string', nullable: true },
        long_description: { type: 'string', nullable: true }
      }
    },
    ProductCategory: {
      type: 'object',
      properties: {
        idProductCategory: { type: 'integer' },
        label: { type: 'string' },
        description: { type: 'string', nullable: true },
      }
    },
    Region: {
      type: 'object',
      properties: {
        idRegion: { type: 'integer' },
        label: { type: 'string' },
      }
    },
    Source: {
      type: 'object',
      properties: {
        idSource: { type: 'integer' },
        label: { type: 'string' },
        description: { type: 'string' },
      }
    },
    Order: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        invoice_no: { type: 'string' },
        payment_id: { type: 'string' },
        plan_id: { type: 'integer' },
        user_id: { type: 'integer' },
        gateway_id: { type: 'integer' },
        amount: { type: 'number', format: 'float' },
        tax: { type: 'number', format: 'float' },
        status: { type: 'integer', description: '0 = pending, 1 = paid' },
        will_expire: { type: 'string', format: 'date-time' },
        meta: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      }
    },
    Plan: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        labelcolor: { type: 'string' },
        iconname: { type: 'string' },
        price: { type: 'number', format: 'float' },
        is_featured: { type: 'integer' },
        is_recommended: { type: 'integer' },
        is_trial: { type: 'integer' },
        status: { type: 'integer' },
        days: { type: 'integer' },
        trial_days: { type: 'integer' },
        data: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      }
    },
    Followup: {
      type: 'object',
      properties: {
        idFollowup: { type: 'integer' },
        start_date: { type: 'string', format: 'date' },
        outcome: { type: 'string' },
        notes: { type: 'string' },
        status: { type: 'string' },
        lead_score: { type: 'number', format: 'float' },
        priority: {
          type: 'string',
          enum: ['CRITICAL', 'IMPORTANT', 'HIGH', 'MEDIUM', 'LOW']
        },
        followup_status: {
          type: 'string',
          enum: ['Hot', 'Warm', 'Cold']
        },
      }
    },
  Country: {
  type: 'object',
  properties: {
    idCountry: { type: 'integer' },
    short_name: { type: 'string' },
    long_name: { type: 'string' },
    iso2: { type: 'string', nullable: true },
    iso3: { type: 'string', nullable: true },
    calling_code: { type: 'string', nullable: true },
    is_un_member: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
}
,
    Enterprise: {
      type: 'object',
      properties: {
        idEnterprise: { type: 'integer' },
        name: { type: 'string' },
        logo: { type: 'string', nullable: true },
        slug: { type: 'string' },
        sector: {
          type: 'string',
          enum: ['Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Logistics', 'Manufacturing', 'Media']
        },
        website: { type: 'string' },
        email_domain: { type: 'string' },
        contact_email: { type: 'string' },
        address: { type: 'string' },
        plan: { type: 'integer' },
        is_verified: { type: 'boolean' },
        subscription_status: { type: 'string' },
        expires_at: { type: 'string', format: 'date-time', nullable: true },
      }
    },
    Business: {
      type: 'object',
      properties: {
        idBusiness: { type: 'integer' },
        need: { type: 'string' },
        stage: {
          type: 'string',
          enum: ['OPPORTUNITY', 'PORPOSAL_SENT', 'NEGOCIATION', 'WON'],
          nullable: true
        },
        approach: { type: 'string', nullable: true },
        engagement_score: { type: 'number', format: 'float' },
        client_constraints: { type: 'string', nullable: true },
        business_type: { type: 'string', nullable: true },
        case_level: { type: 'string', nullable: true },
        total_turnover: { type: 'string', nullable: true },
        potential_time_for_delivery: { type: 'string', nullable: true },
        case_started_date: { type: 'string', format: 'date-time', nullable: true },
        current_supplier: { type: 'string', nullable: true },
        previous_vc: { type: 'string', nullable: true },
        turnover_signable: { type: 'string', nullable: true },
        notes: { type: 'string', nullable: true },
        closed_date: { type: 'string', format: 'date-time', nullable: true },
      }
    },
    Competitor: {
      type: 'object',
      properties: {
        idCompetitor: { type: 'integer' },
        last_updated: { type: 'string', format: 'date-time', nullable: true },
        name: { type: 'string' },
        sector: { type: 'string', nullable: true },
        headquater_location: { type: 'string', nullable: true },
        reference_clients: { type: 'string', nullable: true },
        product_line: { type: 'string', nullable: true },
        website: { type: 'string', nullable: true },
        notes: { type: 'string', nullable: true },
      }
    },
    Gateway: {
      type: 'object',
      properties: {
        id: { type: 'integer' },

        name: { type: 'string' },
        currency: { type: 'string' },
        logo: { type: 'string' },
        charge: { type: 'number', format: 'float' },
        multiply: { type: 'number', format: 'float' },
        namespace: { type: 'string' },
        min_amount: { type: 'number', format: 'float' },
        max_amount: { type: 'number', format: 'float' },
        is_auto: { type: 'integer' },
        image_accept: { type: 'integer' },
        test_mode: { type: 'integer' },
        status: { type: 'integer' },
        phone_required: { type: 'integer' },
        data: { type: 'string' },
        comment: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
      
    }
  }
};
