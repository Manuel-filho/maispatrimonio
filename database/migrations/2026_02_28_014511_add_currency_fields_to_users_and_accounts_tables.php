<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa as migrações.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('preferred_currency_id')->nullable()->constrained('currencies')->onDelete('set null');
        });

        Schema::table('accounts', function (Blueprint $table) {
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->onDelete('set null');
        });
    }

    /**
     * Reverte as migrações.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['preferred_currency_id']);
            $table->dropColumn('preferred_currency_id');
        });

        Schema::table('accounts', function (Blueprint $table) {
            $table->dropForeign(['currency_id']);
            $table->dropColumn('currency_id');
        });
    }
};
