-- ==============================================================================
-- MULTI-TENANT AI VOICE RECEPTIONIST SAAS DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants / Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    industry VARCHAR(100) NOT NULL DEFAULT 'healthcare', -- healthcare, real_estate, retail, auto_repair, dental, salon, legal, other
    phone_number VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    timezone VARCHAR(100) DEFAULT 'America/New_York',
    business_hours JSONB DEFAULT '{"monday": {"open": "09:00", "close": "17:00", "isOpen": true}, "tuesday": {"open": "09:00", "close": "17:00", "isOpen": true}, "wednesday": {"open": "09:00", "close": "17:00", "isOpen": true}, "thursday": {"open": "09:00", "close": "17:00", "isOpen": true}, "friday": {"open": "09:00", "close": "17:00", "isOpen": true}, "saturday": {"open": "10:00", "close": "15:00", "isOpen": false}, "sunday": {"open": "10:00", "close": "15:00", "isOpen": false}}'::jsonb,
    logo_url TEXT,
    website VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'pro', -- starter, pro, enterprise
    minutes_used INT DEFAULT 0,
    minutes_limit INT DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. AI Voice Agents Table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Front Desk Receptionist',
    type VARCHAR(50) NOT NULL DEFAULT 'inbound', -- inbound, outbound, hybrid
    voice_id VARCHAR(100) DEFAULT 'alloy', -- alloy, echo, fable, onyx, nova, shimmer
    voice_speed NUMERIC(3,2) DEFAULT 1.0,
    voice_pitch NUMERIC(3,2) DEFAULT 1.0,
    system_prompt TEXT NOT NULL,
    greeting_message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, draft
    forwarding_phone VARCHAR(50),
    max_call_duration_seconds INT DEFAULT 600,
    auto_book_appointments BOOLEAN DEFAULT true,
    collect_lead_info BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Services / Catalog
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 30,
    price NUMERIC(10,2) DEFAULT 0.00,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Knowledge Base Items
CREATE TABLE IF NOT EXISTS knowledge_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    category VARCHAR(100) DEFAULT 'faq', -- faq, policy, pricing, location, staff, urgent_protocol
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, pending, completed, cancelled, no_show
    notes TEXT,
    booked_via VARCHAR(50) DEFAULT 'ai_voice', -- ai_voice, manual, web_portal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CRM Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new', -- new, qualified, tour_scheduled, follow_up, converted, lost
    score INT DEFAULT 70, -- 1-100
    source VARCHAR(100) DEFAULT 'AI Phone Call',
    interest VARCHAR(255),
    budget VARCHAR(100),
    ai_summary TEXT,
    last_contact_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Call Logs Table
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    caller_name VARCHAR(255),
    caller_phone VARCHAR(50),
    direction VARCHAR(50) DEFAULT 'inbound', -- inbound, outbound
    duration_seconds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed', -- completed, missed, transferred, failed
    sentiment VARCHAR(50) DEFAULT 'positive', -- positive, neutral, negative
    recording_url TEXT,
    transcript JSONB DEFAULT '[]'::jsonb, -- Array of {speaker: 'ai'|'caller', text: string, timestamp: number}
    ai_summary TEXT,
    outcome VARCHAR(100) DEFAULT 'Appointment Booked',
    action_taken VARCHAR(100),
    transferred_to VARCHAR(50),
    cost NUMERIC(6,4) DEFAULT 0.05,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Outbound Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'scheduled', -- draft, running, paused, completed, scheduled
    total_leads INT DEFAULT 0,
    calls_completed INT DEFAULT 0,
    appointments_booked INT DEFAULT 0,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Widget Configurations Table
CREATE TABLE IF NOT EXISTS widget_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE UNIQUE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    title VARCHAR(255) DEFAULT 'AI Voice Assistant',
    subtitle VARCHAR(255) DEFAULT 'Talk or chat in real-time',
    primary_color VARCHAR(50) DEFAULT '#0e8f94',
    button_text VARCHAR(100) DEFAULT 'Talk with AI Assistant',
    greeting VARCHAR(255) DEFAULT 'Hi there! How can I assist you today?',
    position VARCHAR(50) DEFAULT 'bottom-right', -- bottom-right, bottom-left
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast multi-tenant queries
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_agents_business ON agents(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_business ON leads(business_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_business ON call_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_business ON knowledge_items(business_id);
