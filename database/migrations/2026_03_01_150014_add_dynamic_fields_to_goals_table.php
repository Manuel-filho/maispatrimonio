<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('goals', function (Blueprint $table) {
            $table->string('description')->nullable()->after('name');
            $table->string('status')->default('em_progresso')->after('due_date'); // em_progresso, concluida, cancelada
            $table->string('color')->default('#4f46e5')->after('status');
            $table->string('icon')->default('target')->after('color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('goals', function (Blueprint $table) {
            $table->dropColumn(['description', 'status', 'color', 'icon']);
        });
    }
};
